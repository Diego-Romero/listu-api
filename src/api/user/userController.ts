import express from 'express';
import status, { OK } from 'http-status';
import passport from 'passport';
import UserService from '../../services/userService';
import UserSignUpDto from '../../dto/user/userSignUpDto';
import validateDTO from '../../middleware/validateDto';
import UserLoginDto from '../../dto/user/userLoginDto';
import { isAuthenticated } from '../../middleware/isAuthenticated';

const userRouter = express.Router();

userRouter.post(`/register`, validateDTO(UserSignUpDto), async (req, res) => {
  const userService = new UserService();
  try {
    await userService.register(req.body);
    return res.status(status.CREATED).json({ message: 'Account created.' });
  } catch (e) {
    return res.status(status.BAD_REQUEST).json({ message: 'Email already exists' });
  }
});

userRouter.post(
  '/login',
  validateDTO(UserLoginDto),
  passport.authenticate('local'),
  async (_req, res) => {
    res.sendStatus(status.OK);
  },
);

userRouter.post('/logout', async (req, res) => {
  req.logout();
  res.sendStatus(status.OK);
});

userRouter.get('/me', isAuthenticated, async (req, res) => {
  const { user } = req;
  res.status(OK).json(user);
});

export default userRouter;
