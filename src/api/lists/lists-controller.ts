import express from 'express';
import { BAD_REQUEST, CREATED } from 'http-status';
import CreateListDto from '../../dto/user/createListDto';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import validateDTO from '../../middleware/validateDto';
import { User } from '../../models/userModel';
import ListService from '../../services/listService';

const listRouter = express.Router();
const listService = new ListService();

listRouter.post('/', isAuthenticated, validateDTO(CreateListDto), async (req, res) => {
  const { user } = req;
  try {
    const listRecord = await listService.createList(req.body, user as User);
    return res.status(CREATED).json(listRecord);
  } catch (err) {
    return res.status(BAD_REQUEST).json({ message: err.toString() });
  }
});

export default listRouter;
