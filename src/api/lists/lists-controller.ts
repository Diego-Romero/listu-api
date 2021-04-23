import express from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status';
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

listRouter.get('/:id', isAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
    const listRecord = await listService.getListById(id);
    return res.status(OK).json(listRecord);
  } catch (err) {
    return res.status(BAD_REQUEST).json({ message: err.toString() });
  }
});

export default listRouter;
