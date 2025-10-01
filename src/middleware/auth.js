// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || req.cookies?.['SessionID'];
  let token = null;

  if (header?.startsWith('Bearer ')) token = header.split(' ')[1];
  else if (req.query?.token) token = req.query.token;
  else if (req.cookies?.['SessionID']) token = req.cookies['SessionID'];

  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = { _id: user._id, email: user.email, role: user.role };
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', details: err.message });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
  next();
}

module.exports = { requireAuth, requireAdmin };
