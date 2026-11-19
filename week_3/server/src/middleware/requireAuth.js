// middleware/requireAuth.js
// Reads the session from the cookie. If there is no session (or it is
// expired), the request is rejected with 401. Otherwise it attaches
// req.session.user and calls next().
export default function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
}