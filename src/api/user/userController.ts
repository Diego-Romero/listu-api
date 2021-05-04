import express from 'express';
import status, { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import passport from 'passport';
import UserService from '../../services/userService';
import UserSignUpDto from '../../dto/user/userSignUpDto';
import validateDTO from '../../middleware/validateDto';
import UserLoginDto from '../../dto/user/userLoginDto';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { filterUserInReq } from '../../utils';
import { User } from '../../models/userModel';
import InviteFriendDto from '../../dto/user/inviteFriendDto';
import ListService from '../../services/listService';
import { EmailService } from '../../services/emailService';
import RegisterFriendDTO from '../../dto/user/registerFriendDto';
import ForgotPasswordDto from '../../dto/user/forgot-password-dto';
import crypto from 'crypto';
import ResetPasswordDto from '../../dto/user/resetPasswordDto';

const userRouter = express.Router();
const userService = new UserService();
const listService = new ListService();
const emailService = new EmailService();

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

userRouter.post(`/forgot-password`, validateDTO(ForgotPasswordDto), async (req, res) => {
  try {
    const user = await userService.getUserFromEmail(req.body.email);
    if (user === null) return res.status(NOT_FOUND).json({ message: 'User not found' });
    crypto.randomBytes(20, async (err, buf) => {
      if (err)
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ message: 'There has been an error with your request, please try again later.' });
      const token: string = buf.toString('hex');
      user.resetPasswordToken = token;
      await user.save();
      await emailService.sendResetPasswordEmail(user.email, token);
      // send email as wel
      return res.status(200).json({
        message: 'Please check your email with further instructions on how to reset your password.',
      });
    });
  } catch (error) {
    return res.status(400).json({
      message: 'There has been an error with your request, please try again later.',
      error: error.toString(),
    });
  }
});

userRouter.post('/reset-password/:token', validateDTO(ResetPasswordDto), async (req, res) => {
  const token = req.params.token;
  const user = await userService.getUserByPasswordResetToken(token);
  if (user === null)
    return res
      .status(BAD_REQUEST)
      .json({ message: 'Token is invalid, try to reset the password again.' });

  await userService.resetUserPassword(req.body.password, user._id);
  res.status(OK).json({ message: 'New password has been set, you can now log in.' });
});

userRouter.post(`/friend/register/:id`, validateDTO(RegisterFriendDTO), async (req, res, next) => {
  const id = req.params.id;
  console.log(id, req.body);
  try {
    const user = await userService.getUser(id);
    console.log(user);
    if (user === null)
      return res
        .status(BAD_REQUEST)
        .json({ message: `Friend with this email has not been invited yet.` });

    if (user.password && user.password.length > 0)
      return res.status(BAD_REQUEST).json({ message: 'User has already been registered' });

    const updatedUser = await userService.registerFriend(req.body, id);
    req.login(updatedUser, function (err) {
      if (err) return next(err);
      return res.status(status.CREATED).json(filterUserInReq(updatedUser as User));
    });
  } catch (e) {
    return res.status(status.BAD_REQUEST).json({
      message: 'There has been an error creating this user, please try again later.',
      error: e.toString(),
    });
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
      if (userRecord === null) res.status(NOT_FOUND).json({ message: 'User not found' });
      else res.status(status.OK).json(filterUserInReq(userRecord));
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
  try {
    const { user } = req;
    const expressUser = user as User;
    const userRecord = await userService.getUser(expressUser._id);
    if (userRecord === null) res.status(NOT_FOUND).json({ message: 'User not found' });
    else {
      res.status(status.OK).json(filterUserInReq(userRecord));
    }
  } catch (e) {
    return res.status(status.BAD_REQUEST).json({ message: e.toString() });
  }
});

userRouter.post(
  '/friend/:listId',
  isAuthenticated,
  validateDTO(InviteFriendDto),
  async (req, res) => {
    const listId = req.params.listId;
    const { email } = req.body;
    try {
      const listRecord = await listService.getListById(listId);
      if (listRecord === null) res.status(NOT_FOUND).json({ message: 'List not found' });
      else {
        let userRecord = await userService.getUserFromEmail(email);
        if (userRecord === null) {
          // if the user doesn't exist create one with just email. And send them an email so they can create a full user
          userRecord = await userService.createUserFromEmail(email);
          await userService.addListToUserLists(listRecord, userRecord);
          await listService.addUserToList(listRecord, userRecord);
          await emailService.sendAddFriendNewUserEmail(email, userRecord._id);
        } else {
          // otherwise just notify them that they have been added to a new list.
          const userIsAlreadyInList = userRecord.lists.some(
            (userList) => userList._id.toString() === listId,
          );

          if (!userIsAlreadyInList) {
            await userService.addListToUserLists(listRecord, userRecord);
            await listService.addUserToList(listRecord, userRecord);
            await emailService.sendAddedToListEmail(email, listRecord.name);
          } else return res.status(BAD_REQUEST).json({ message: 'User is already in the list' });
        }
        return res.status(OK).json({ message: `${email} has been invited to use this list` });
      }
    } catch (e) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: 'There has been an error processing your request, please try again later.',
        error: e.toString(),
      });
    }
  },
);

export default userRouter;
