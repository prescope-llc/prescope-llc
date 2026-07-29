// /api/usage
// Tracks and enforces free tier generation limits using Vercel KV.
// Free tier: 3 generations per calendar month per user.
// Paid users bypass this entirely.

// Vercel KV is a Redis-compatible key-value store.
// Add KV to your Vercel project: Dashboard → Storage → Create KV Store → link to project.
// This auto-injects KV_REST_API_URL and KV_REST_API_TOKEN env vars.

const FREE_TIER_LIMIT = 2;

async function kvGet(key) {
  const res = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  const data = await res.json();
  return data.result ?? null;
}

async function kvSet(key, value, expirySeconds) {
  const url = expirySeconds
    ? `${process.env.KV_REST_API_URL}/set/${key}/${value}?ex=${expirySeconds}`
    : `${process.env.KV_REST_API_URL}/set/${key}/${value}`;
  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
}

async function kvIncr(key) {
  const res = await fetch(`${process.env.KV_REST_API_URL}/incr/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  const data = await res.json();
  return data.result ?? 1;
}

function monthKey(userId) {
  const now = new Date();
  return `usage:${userId}:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function secondsUntilEndOfMonth() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.floor((end - now) / 1000) + 60; // +60s buffer
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { userId, action } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  // Check if KV is configured
  if (!process.env.KV_REST_API_URL) {
    // KV not set up — allow through (better to let user proceed than block)
    return res.status(200).json({ allowed: true, count: 0, limit: FREE_TIER_LIMIT, kvMissing: true });
  }

  const key = monthKey(userId);

  try {
    if (action === 'check') {
      // Just check current count without incrementing
      const count = parseInt(await kvGet(key) || '0', 10);
      return res.status(200).json({
        allowed: count < FREE_TIER_LIMIT,
        count,
        limit: FREE_TIER_LIMIT,
        remaining: Math.max(0, FREE_TIER_LIMIT - count),
      });
    }

    if (action === 'increment') {
      // Increment and return new count
      const current = parseInt(await kvGet(key) || '0', 10);
      if (current >= FREE_TIER_LIMIT) {
        return res.status(200).json({ allowed: false, count: current, limit: FREE_TIER_LIMIT, remaining: 0 });
      }
      const newCount = await kvIncr(key);
      // Set expiry on first increment so key auto-clears at month end
      if (newCount === 1) {
        await kvSet(key, newCount, secondsUntilEndOfMonth());
      }
      return res.status(200).json({
        allowed: true,
        count: newCount,
        limit: FREE_TIER_LIMIT,
        remaining: Math.max(0, FREE_TIER_LIMIT - newCount),
      });
    }

    return res.status(400).json({ error: 'Invalid action. Use check or increment.' });

  } catch (err) {
    console.error('Usage error:', err);
    // On error, allow through — don't block users due to infrastructure issues
    return res.status(200).json({ allowed: true, count: 0, limit: FREE_TIER_LIMIT, error: 'KV unavailable' });
  }
}
