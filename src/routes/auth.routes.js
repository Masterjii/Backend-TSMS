// backend/src/routes/auth.routes.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../utils/passport-google')(); // initialize Google strategy
const router = express.Router();

// Start Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    const user = req.user;
    const payload = {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    const userStr = encodeURIComponent(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
    res.redirect(`${frontendUrl}/?token=${token}&user=${userStr}`);
  }
);

// Failure route
router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'OAuth login failed' });
});

module.exports = router;
