// /api/usage
// Tracks and enforces free tier generation limits using Vercel KV.
// Free tier: 3 generations per calendar month per user.
// Paid users bypass this entirely.

// Vercel KV is a Redis-compatible key-value store.
// Add KV to your Vercel project: Dashboard → Storage → Create KV Store → link to project.
// This auto-injects KV_REST_API_URL and KV_REST_API_TOKEN env vars.

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
    throw new Error(data.error || 'Vercel KV request failed');
  }

  return data.result;
}

function currentUsageKey(userId) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');

  return `prescope:usage:${userId}:${year}-${month}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ')
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
    const usageKey = currentUsageKey(userId);

    if (action === 'check') {
      const storedCount = await runKvCommand('get', usageKey);
      const used = Number(storedCount || 0);

      return res.status(200).json({
        allowed: used < FREE_LIMIT,
        used,
        remaining: Math.max(0, FREE_LIMIT - used),
        limit: FREE_LIMIT
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
        used,
        remaining: Math.max(0, FREE_LIMIT - used),
        limit: FREE_LIMIT
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
