import express, {Request, Response} from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {passport} from './auth/passport.google';
import cookieSession from 'cookie-session';
import { errorHandler } from './common/errorHandler/errorHandler';
import { authRouter } from './auth/router';
import { uploadRouter } from './loader/uplodRouter';

const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true},
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
/*
app.use(
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
  })
);
*/

app.get('/', (req, res) => {
  res.send(
    '<a href=/auth>Authorization whith Google</a> <a href=/uload>Upload JPEG</a>'
  );
});

app.use(session({secret: 'cats', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);
app.use(uploadRouter);

app.use(errorHandler);
app.listen(8080, () => console.log('listening on port: 8080'));
