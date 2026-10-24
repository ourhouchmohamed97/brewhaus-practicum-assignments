import jwt from 'jsonwebtoken';

export default function requireAuth(req, res, next) {
  const token = req.cookies.token; // cookie-parser puts cookies in req.cookies

  if (!token) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}