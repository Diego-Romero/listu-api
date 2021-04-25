import express from 'express';
import status from 'http-status';
import passport from 'passport';
import UserService from '../../services/userService';
import UserSignUpDto from '../../dto/user/userSignUpDto';
import validateDTO from '../../middleware/validateDto';
import UserLoginDto from '../../dto/user/userLoginDto';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { filterUserInReq } from '../../utils';
import { User } from '../../models/userModel';

const userRouter = express.Router();
const userService = new UserService();

userRouter.post(`/register`, validateDTO(UserSignUpDto), async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    req.login(user, function (err) {
      if (err) return next(err);
      return res.status(status.CREATED).json(filterUserInReq(user as User));
    });
  } catch (e) {
    return res.status(status.BAD_REQUEST).json({ message: 'Email already exists' });
  }
});

userRouter.post(
  '/login',
  validateDTO(UserLoginDto),
  passport.authenticate('local'),
  async (req, res) => {
    try {
      const { user } = req;
      const expressUser = user as User;
      const userRecord = await userService.getUser(expressUser._id);
      res.status(status.OK).json(filterUserInReq(userRecord));
    } catch (e) {
      return res.status(status.BAD_REQUEST).json({ message: e.toString() });
    }
  },
);

userRouter.post('/logout', async (req, res) => {
  req.logout();
  res.sendStatus(status.OK);
});

userRouter.get('/me', isAuthenticated, async (req, res) => {
  res.cookie('cookieName', 'cookieValue');
  try {
    const { user } = req;
    const expressUser = user as User;
    const userRecord = await userService.getUser(expressUser._id);
    res.status(status.OK).json(filterUserInReq(userRecord));
  } catch (e) {
    return res.status(status.BAD_REQUEST).json({ message: e.toString() });
  }
});

export default userRouter;
