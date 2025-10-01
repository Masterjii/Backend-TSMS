// backend/src/utils/passport-google.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

module.exports = function initGooglePassport() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth credentials not set. Skipping Google strategy.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email found in Google profile'));

          // Find or create user
          let user = await User.findOne({ email });
          if (!user) {
            user = new User({ email, name: profile.displayName });
          }

          // store provider id
          user.providers = user.providers || {};
          user.providers.google = { id: profile.id };

          // determine role
          const adminEmails = (process.env.ADMIN_EMAILS || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          const adminDomain = (process.env.ADMIN_DOMAIN || '').trim(); // like "@company.com"

          if (adminEmails.includes(email) || (adminDomain && email.endsWith(adminDomain))) {
            user.role = 'admin';
          } else if (!user.role) {
            user.role = 'agent'; // default
          }

          await user.save();
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
