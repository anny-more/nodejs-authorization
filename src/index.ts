//import cookieSession from 'cookie-session';
import express from 'express';
//import session from 'express-session';
//import passport from 'passport';
//import {passport} from './auth/google';
import {userDB} from './db.controller/users.id';
import {uploadJpeg} from './db.controller/upload';
import {upload} from './loader/multer';
import {download} from './db.controller/dowload';

const app = express();

//get id for unloged user
app.get('/', userDB);

//multer
app.post('/upload', upload, uploadJpeg);

//download files
app.get('/download', download);

app.listen(8080, () => console.log('listening on port: 8080'));

/*
function isLoggedIn(req: Request, res: Response, next: Function) {
  req.user ? next() : res.sendStatus(401);
}
app.use(session({secret: 'cats', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/auth/google',
  passport.authenticate('google', {scope: ['email', 'profile']})
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure',
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  console.log(req.user);
  res.send(`Hello ${req.user}`);
});

app.get('/logout', (req, res) => {
  req.logout(err => {
    console.log(err);
  });
  req.session.destroy(err => {
    console.log(err);
  });
  console.log(req.body);
  res.send('Goodbye!');
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});
*/
