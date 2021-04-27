import express from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status';
import CreateListDto from '../../dto/user/createListDto';
import CreateListItemDto from '../../dto/user/createListItemDto';
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

listRouter.post('/:listId', isAuthenticated, validateDTO(CreateListItemDto), async (req, res) => {
  const { user } = req;
  const listId = req.params.listId;
  try {
    const listItemRecord = await listService.createListItem(req.body, user as User, listId);
    return res.status(CREATED).json(listItemRecord);
  } catch (err) {
    return res.status(BAD_REQUEST).json({ message: err.toString() });
  }
});

listRouter.delete('/:listId/:itemId', isAuthenticated, async (req, res) => {
  const listId = req.params.listId;
  const itemId = req.params.itemId;
  try {
    await listService.deleteListItem(listId, itemId);
    const updatedList = await listService.getListById(listId);
    return res.status(OK).json({ message: 'Item marked as completed', list: updatedList });
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
