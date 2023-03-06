import { profile } from "console";
import {Request, Router} from "express";
import { Profile } from "passport";
import {passport, passportValidation} from './passport.google';

const authRouter = Router();

authRouter.get(
  '/auth',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);
authRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/upload',
    },
  )
);

authRouter.get('/protected', (req: Request, res) => {
  console.log('!!user', req.user);
  res.send('Hello'); //.json({authorize: id});
});

authRouter.get('/logout', (req, res) => {
  req.logout(err => {
    console.log(err);
  });
  req.session.destroy(err => {
    console.log(err);
  });
  console.log(req.body);
  res.send('Goodbye!');
});

export {authRouter};
