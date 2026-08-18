// /api/usage
// Enforces Prescope access:
// - Paid users: unlimited
// - Active 14-day trial users: unlimited
// - Free users: 2 generations per calendar month

import { verifyToken } from '@clerk/backend';

const FREE_LIMIT = 2;
const KEY_TTL_SECONDS = 2678400;

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
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(
      data.error || 'Vercel KV request failed'
    );
  }

  return data.result;
}

function entitlementKey(userId) {
  return `prescope:entitlement:${userId}`;
}

function currentUsageKey(userId) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(
    now.getUTCMonth() + 1
  ).padStart(2, '0');

  return `prescope:usage:${userId}:${year}-${month}`;
}

async function getEntitlement(userId) {
  const stored = await runKvCommand(
    'get',
    entitlementKey(userId)
  );

  if (!stored) {
    return null;
  }

  try {
    return typeof stored === 'string'
      ? JSON.parse(stored)
      : stored;
  } catch {
    return null;
  }
}

function evaluateStoredTrial(record) {
  const trialEndsAt = record?.trialEndsAt
    ? new Date(record.trialEndsAt).getTime()
    : 0;

  const remainingMilliseconds =
    trialEndsAt - Date.now();

  if (
    record?.trialClaimed &&
    trialEndsAt > 0 &&
    remainingMilliseconds > 0
  ) {
    return {
      active: true,
      daysRemaining: Math.max(
        1,
        Math.ceil(
          remainingMilliseconds /
            (24 * 60 * 60 * 1000)
        )
      )
    };
  }

  return {
    active: false,
    daysRemaining: 0
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const authorization =
      req.headers.authorization || '';

    const token = authorization.startsWith(
      'Bearer '
    )
      ? authorization.slice(7)
      : '';

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const session = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    const userId = session.sub;

    if (!userId) {
      return res.status(401).json({
        error: 'Invalid authentication session'
      });
    }

    const action = req.body?.action;
    const record = await getEntitlement(userId);
    const trial = evaluateStoredTrial(record);

    /*
     * Paid status is returned by /api/auth.
     * Trial status is also independently checked here
     * using its server-side expiration date.
     */
    if (trial.active) {
      return res.status(200).json({
        allowed: true,
        plan: 'trial',
        hasFullAccess: true,
        used: 0,
        remaining: null,
        limit: null,
        trialEndsAt: record.trialEndsAt,
        trialDaysRemaining: trial.daysRemaining
      });
    }

    const usageKey = currentUsageKey(userId);

    if (action === 'check') {
      const storedCount = await runKvCommand(
        'get',
        usageKey
      );

      const used = Number(storedCount || 0);

      return res.status(200).json({
        allowed: used < FREE_LIMIT,
        plan: 'free',
        hasFullAccess: false,
        used,
        remaining: Math.max(
          0,
          FREE_LIMIT - used
        ),
        limit: FREE_LIMIT,
        trialEndsAt:
          record?.trialEndsAt || null,
        trialDaysRemaining: 0
      });
    }

    if (action === 'increment') {
      const used = Number(
        await runKvCommand('incr', usageKey)
      );

      if (used === 1) {
        await runKvCommand(
          'expire',
          usageKey,
          KEY_TTL_SECONDS
        );
      }

      return res.status(200).json({
        allowed: used <= FREE_LIMIT,
        plan: 'free',
        hasFullAccess: false,
        used,
        remaining: Math.max(
          0,
          FREE_LIMIT - used
        ),
        limit: FREE_LIMIT,
        trialEndsAt:
          record?.trialEndsAt || null,
        trialDaysRemaining: 0
      });
    }

    return res.status(400).json({
      error: 'Invalid usage action'
    });
  } catch (error) {
    console.error('Usage API error:', error);

    return res.status(500).json({
      error: 'Unable to check usage'
    });
  }
}
