import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import UserModel, { User } from '../models/userModel';
import passportJWT from 'passport-jwt';
import config from '../config/config';

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    const user = await UserModel.findOne({ email: username });
    if (!user) {
      return done(null, false, {
        message: 'unable to authenticate with those details',
      });
    }
    if (!(await bcrypt.compare(password, user.password as string))) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  }),
);

passport.use(
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret as string,
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: User, done) => {
  done(null, user);
});
