// CORS middleware configuration.
// Credentials: true allows cookies to be sent cross-origin.
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export function configureCors(app) {
  app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Allow the configured client URL, plus any localhost origin during dev.
    if (origin === CLIENT_URL || origin?.startsWith('http://localhost')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Pre-flight requests can be answered immediately.
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });
}