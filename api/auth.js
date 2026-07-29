// /api/auth
// Verifies a Clerk session token, returns user info + Stripe subscription status.
// Called on app load to determine free vs paid access.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionToken } = req.body || {};
  if (!sessionToken) return res.status(401).json({ error: 'No session token' });

  try {
    // ── 1. Verify Clerk session token ──────────────────────────────────────────
    const clerkRes = await fetch('https://api.clerk.com/v1/sessions/' + sessionToken + '/verify', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.CLERK_SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!clerkRes.ok) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const session = await clerkRes.json();
    const userId   = session.user_id;
    const email    = session.public_user_data?.identifier || '';

    // ── 2. Check Stripe subscription ──────────────────────────────────────────
    let plan = 'free'; // default

    if (process.env.STRIPE_SECRET_KEY && email) {
      try {
        // Search for customer by email
        const custRes = await fetch(
          `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`,
          { headers: { 'Authorization': 'Bearer ' + process.env.STRIPE_SECRET_KEY } }
        );
        const custData = await custRes.json();
        const customer = custData.data?.[0];

        if (customer) {
          // Check for active subscription
          const subRes = await fetch(
            `https://api.stripe.com/v1/subscriptions?customer=${customer.id}&status=active&limit=1`,
            { headers: { 'Authorization': 'Bearer ' + process.env.STRIPE_SECRET_KEY } }
          );
          const subData = await subRes.json();
          if (subData.data?.length > 0) {
            plan = 'paid';
          }
        }
      } catch (stripeErr) {
        // If Stripe check fails, default to free — don't block the user
        console.error('Stripe check failed:', stripeErr.message);
      }
    }

    return res.status(200).json({ userId, email, plan });

  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
