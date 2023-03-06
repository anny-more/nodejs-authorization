import {Request, Response, NextFunction} from 'express';
// eslint-disable-next-line node/no-unpublished-import
import passport, {Profile} from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import * as dotenv from 'dotenv';
import { UserService, usersStorage } from '../service/user.service';
import { nanoid } from 'nanoid';
import { getUserID } from '../service/getUserID';
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Object, done) => {
  return done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '495972208522-dp8m651frdka18s7o1dgqqltsvdvkt6r.apps.googleusercontent.com', //process.env.GOOGLE_CLIENT_ID,
      clientSecret: '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', //process.env.GOOGLE_CLIENT_ID,
      callbackURL: 'http://localhost:8080/auth/google/callback',
      passReqToCallback: true,
    },
    (
      request: Request,
      response: Response,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: Function
    ) => {
      const googleId = profile.id;
      //const id = getUserID(request);
      let user = usersStorage.find(item => item.googleId === googleId);
      if (!user) {
        user = new UserService(nanoid(), googleId, '', true);
        usersStorage.push(user);
      }
      request.user = user.id;
      console.log('req', request.user);
      return done(null, user);
    }
  )
);

export const passportValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) return next(err);

    if (user) {
      req.user = user;
      return next();
    } else {
      return res.status(401).json({status: 'error', code: 'unauthorized'});
    }
  })(req, res, next);
};

export {passport};
