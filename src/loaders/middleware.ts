import { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import config from '../config/config';
import cors from 'cors';

export function setMiddleWare(app: Express): void {
  const sharedCookieConfig = {
    maxAge: 10 * 60 * 1000 * 100000,
  };
  const sharedSessionConfig = {
    secret: config.sessionSecret || '',
    resave: false,
    saveUninitialized: true,
    cookie: sharedCookieConfig,
  };

  const devSessionConfig = {
    ...sharedSessionConfig,
    cookie: {
      ...sharedCookieConfig,
      secure: false,
      sameSite: false,
    },
  };

  const prodSessionConfig = {
    ...sharedSessionConfig,
    cookie: {
      ...sharedCookieConfig,
      secure: true,
      sameSite: 'none',
    },
  };

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
  }

  app.use(cookieParser());
  app.use(
    cors({
      origin: config.clientUrl,
      methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'],
      credentials: true,
    }),
  );

  const sessionConfig = config.env === 'production' ? prodSessionConfig : devSessionConfig;
  // console.log('session config', sessionConfig);
  // @ts-ignore
  app.use(session(sessionConfig)); // sessions has to go before passport sessions
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());
  const morganFormat = config.env === 'production' ? 'combined' : 'dev';
  app.use(morgan(morganFormat));
}
