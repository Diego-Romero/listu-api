import { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import config from '../config/config';
import cors from 'cors';

export function setMiddleWare(app: Express): void {
  const sessionConfig = {
    secret: config.sessionSecret || '',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  };

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sessionConfig.cookie.secure = true; // serve secure cookies
  }

  app.use(cors());
  app.use(session(sessionConfig)); // sessions has to go before passport sessions
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan('dev'));
}
