// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const SamlStrategy = require('passport-saml').Strategy;
// const User = require('../models/user.model');

// module.exports = function init(){
//   passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL
//   }, async (accessToken, refreshToken, profile, done) => {
//     try {
//       const email = profile.emails && profile.emails[0] && profile.emails[0].value;
//       let user = await User.findOne({ email });
//       if(!user){
//         user = await User.create({ email, name: profile.displayName, providers: { google: { id: profile.id } }, role: 'admin' }); // example: make admin for testing
//       } else {
//         user.providers.google = { id: profile.id };
//         await user.save();
//       }
//       return done(null, user);
//     } catch(err){
//       return done(err);
//     }
//   }));

//   // SAML strategy (skeleton)
//   passport.use(new SamlStrategy({
//     entryPoint: process.env.SAML_ENTRY_POINT,
//     issuer: process.env.SAML_ISSUER,
//     callbackUrl: process.env.SAML_CALLBACK_URL,
//     cert: process.env.SAML_CERT // optional
//   }, async (profile, done) => {
//     // profile contains user attributes from IdP
//     try {
//       const email = profile.email || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
//       let user = await User.findOne({ email });
//       if(!user) user = await User.create({ email, name: profile.displayName || email, providers: { saml: { id: profile.nameID } }, role: 'admin' });
//       return done(null, user);
//     } catch(err){
//       return done(err);
//     }
//   }));
// };
