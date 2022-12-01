import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import { UserGoogleSchema } from '../schemas/UserGoogle.schema.js';

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, (profile, done) => {

    // Check if google profile exist.
    if (profile.id) {

      UserGoogleSchema.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new UserGoogleSchema({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.name.familyName + ' ' + profile.name.givenName
            })
              .save()
              .then(user => done(null, user));
          }
        })
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserGoogleSchema.findById(id)
    .then(user => {
      done(null, user);
    })
});