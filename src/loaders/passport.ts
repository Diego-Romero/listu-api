import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import UserModel, { User } from '../models/userModel';

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      const user = await UserModel.findOne({ email: username });
      if (!user) {
        return done(null, false, {
          message: 'unable to authenticate with those details',
        });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: User, done) => {
  done(null, user);
});
