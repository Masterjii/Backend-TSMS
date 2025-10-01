const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Serialize / Deserialize (for sessions, optional)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Normally, you would check the DB for existing user or create a new one
        const user = {
          _id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          role: "admin", // default role
        };
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
