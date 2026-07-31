import { verifyToken } from '@clerk/backend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    const {
      model = 'claude-sonnet-4-6',
      max_tokens = 4096,
      system,
      messages
    } = req.body || {};

    if (!system || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid generation request' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'Anthropic API key is not configured'
      });
    }

    const anthropicResponse = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens,
          system,
          messages
        })
      }
    );

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      console.error('Anthropic request failed:', data);

      return res.status(anthropicResponse.status).json({
        error: data?.error?.message || 'Generation request failed'
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Generate API error:', error);

    return res.status(401).json({
      error: 'Invalid or expired authentication session'
    });
  }
}
