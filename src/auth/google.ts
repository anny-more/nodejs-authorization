import {Request} from 'express';
import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '495972208522-dp8m651frdka18s7o1dgqqltsvdvkt6r.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:8080/auth/google/callback',
      passReqToCallback: true,
    },
    (
      request: Request,
      accessToken: string,
      refreshToken: string,
      profile: Object,
      done: Function
    ) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: Object, done) => {
  return done(null, obj);
});

export {passport};
