import express from 'express';
import status, { OK } from 'http-status';
import passport from 'passport';
import UserService from '../../services/userService';
import UserSignUpDto from '../../dto/user/userSignUpDto';
import validateDTO from '../../middleware/validateDto';
import UserLoginDto from '../../dto/user/userLoginDto';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { filterUserInReq } from '../../utils';
import { User } from '../../models/userModel';

const userRouter = express.Router();

userRouter.post(`/register`, validateDTO(UserSignUpDto), async (req, res, next) => {
  const userService = new UserService();
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
    const { user } = req;
    res.status(status.OK).json(filterUserInReq(user as User));
  },
);

userRouter.post('/logout', async (req, res) => {
  req.logout();
  res.sendStatus(status.OK);
});

userRouter.get('/me', isAuthenticated, async (req, res) => {
  const { user } = req;
  res.status(status.OK).json(filterUserInReq(user as User));
});

export default userRouter;
