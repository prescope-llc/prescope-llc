import { verifyToken } from '@clerk/backend';

// /api/auth
// Verifies Clerk, checks Stripe, and creates/evaluates the user's
// one-time 14-day Prescope reverse trial. Replace api/auth.js with this file.

const TRIAL_LENGTH_MS = 14 * 24 * 60 * 60 * 1000;

async function runKvCommand(command, ...args) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error('Vercel KV is not configured');
  }

  const path = [command, ...args]
    .map(value => encodeURIComponent(String(value)))
    .join('/');

  const response = await fetch(`${url}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || 'Vercel KV request failed');
  }

  return data.result;
}

function entitlementKey(userId) {
  return `prescope:entitlement:${userId}`;
}

async function getClerkUser(userId) {
  const response = await fetch(
    `https://api.clerk.com/v1/users/${encodeURIComponent(userId)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Unable to retrieve Clerk user (${response.status})`);
  }

  return response.json();
}

function getPrimaryEmail(user) {
  const primaryEmail =
    user.email_addresses?.find(
      address => address.id === user.primary_email_address_id
    ) || user.email_addresses?.[0];

  return primaryEmail?.email_address || '';
}

async function hasActiveStripeSubscription(email) {
  if (!process.env.STRIPE_SECRET_KEY || !email) {
    return false;
  }

  try {
    const customerResponse = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
        }
      }
    );

    if (!customerResponse.ok) {
      throw new Error(`Stripe customer lookup failed (${customerResponse.status})`);
    }

    const customerData = await customerResponse.json();

    for (const customer of customerData.data || []) {
      const subscriptionResponse = await fetch(
        `https://api.stripe.com/v1/subscriptions?customer=${encodeURIComponent(customer.id)}&status=all&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
          }
        }
      );

      if (!subscriptionResponse.ok) {
        throw new Error(`Stripe subscription lookup failed (${subscriptionResponse.status})`);
      }

      const subscriptionData = await subscriptionResponse.json();

      if (
        subscriptionData.data?.some(
          subscription =>
            subscription.status === 'active' ||
            subscription.status === 'trialing'
        )
      ) {
        return true;
      }
    }
  } catch (error) {
    console.error('Stripe subscription check failed:', error);
  }

  return false;
}

async function getEntitlement(userId) {
  const stored = await runKvCommand('get', entitlementKey(userId));

  if (!stored) return null;

  try {
    return typeof stored === 'string' ? JSON.parse(stored) : stored;
  } catch {
    return null;
  }
}

async function createInitialEntitlement(userId, email, isPaid) {
  const now = new Date();

  const record = isPaid
    ? {
        userId,
        email,
        trialClaimed: true,
        trialStartedAt: null,
        trialEndsAt: null,
        createdAt: now.toISOString()
      }
    : {
        userId,
        email,
        trialClaimed: true,
        trialStartedAt: now.toISOString(),
        trialEndsAt: new Date(
          now.getTime() + TRIAL_LENGTH_MS
        ).toISOString(),
        createdAt: now.toISOString()
      };

  // NX prevents simultaneous requests from restarting or replacing a trial.
  await runKvCommand(
    'set',
    entitlementKey(userId),
    JSON.stringify(record),
    'nx'
  );

  return (await getEntitlement(userId)) || record;
}

function evaluateEntitlement(record, isPaid) {
  if (isPaid) {
    return {
      plan: 'paid',
      hasFullAccess: true,
      trialDaysRemaining: 0
    };
  }

  const trialEndsAt = record?.trialEndsAt
    ? new Date(record.trialEndsAt).getTime()
    : 0;

  const remainingMilliseconds = trialEndsAt - Date.now();

  if (
    record?.trialClaimed &&
    trialEndsAt > 0 &&
    remainingMilliseconds > 0
  ) {
    return {
      plan: 'trial',
      hasFullAccess: true,
      trialDaysRemaining: Math.max(
        1,
        Math.ceil(remainingMilliseconds / (24 * 60 * 60 * 1000))
      )
    };
  }

  return {
    plan: 'free',
    hasFullAccess: false,
    trialDaysRemaining: 0
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionToken } = req.body || {};

  if (!sessionToken) {
    return res.status(401).json({ error: 'No session token' });
  }

  try {
    const claims = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    const userId = claims.sub;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const user = await getClerkUser(userId);
    const email = getPrimaryEmail(user);
    const isPaid = await hasActiveStripeSubscription(email);

    let record = await getEntitlement(userId);

    if (!record) {
      record = await createInitialEntitlement(userId, email, isPaid);
    }

    const entitlement = evaluateEntitlement(record, isPaid);

    return res.status(200).json({
      userId,
      email,
      plan: entitlement.plan,
      hasFullAccess: entitlement.hasFullAccess,
      trialStartedAt: record.trialStartedAt,
      trialEndsAt: record.trialEndsAt,
      trialDaysRemaining: entitlement.trialDaysRemaining
    });
  } catch (error) {
    console.error('Auth error:', error);

    return res.status(401).json({
      error: 'Authentication failed'
    });
  }
}
