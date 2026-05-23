const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

app.get('/check-subscription', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  if (!TOKEN) {
    console.error('CHANNEL_ACCESS_TOKEN not set');
    return res.status(500).json({ error: 'server misconfiguration' });
  }

  try {
    const lineRes = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (lineRes.status === 200) {
      // user follows the LINE OA → subscribed
      const profile = await lineRes.json();
      return res.json({ subscribed: true, displayName: profile.displayName });
    }

    if (lineRes.status === 404) {
      // user does not follow the LINE OA → not subscribed
      return res.json({ subscribed: false });
    }

    // unexpected status
    console.error('LINE API returned:', lineRes.status);
    return res.status(502).json({ error: 'line_api_error', status: lineRes.status });

  } catch (err) {
    console.error('fetch error:', err);
    return res.status(500).json({ error: 'internal_error' });
  }
});

// health check
app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CHECKNAME auth server listening on :${PORT}`));
