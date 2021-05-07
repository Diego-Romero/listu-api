import express from 'express';
import passport from 'passport';
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from 'http-status';
import CreateListDto from '../../dto/user/createListDto';
import CreateListItemDto from '../../dto/user/createListItemDto';
import validateDTO from '../../middleware/validateDto';
import { User } from '../../models/userModel';
import ListService from '../../services/listService';
import { FilteredUser } from '../../utils';
import UpdateListItemDto from '../../dto/user/updateListItemDto';
import { ListItem } from '../../models/ListItemModel';

const listRouter = express.Router();
const listService = new ListService();

listRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateDTO(CreateListDto),
  async (req, res) => {
    const user = req.user as FilteredUser;
    try {
      const listRecord = await listService.createList(req.body, user);
      return res.status(CREATED).json(listRecord);
    } catch (err) {
      return res.status(BAD_REQUEST).json({ message: err.toString() });
    }
  },
);

listRouter.post(
  '/:listId',
  passport.authenticate('jwt', { session: false }),
  validateDTO(CreateListItemDto),
  async (req, res) => {
    const { user } = req;
    const listId = req.params.listId;
    try {
      const listItemRecord = await listService.createListItem(req.body, user as User, listId);
      return res.status(CREATED).json(listItemRecord);
    } catch (err) {
      return res.status(BAD_REQUEST).json({ message: err.toString() });
    }
  },
);

listRouter.delete(
  '/:listId/:itemId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const listId = req.params.listId;
    const itemId = req.params.itemId;
    try {
      await listService.deleteListItem(listId, itemId);
      const updatedList = await listService.getListById(listId);
      return res.status(OK).json({ message: 'List item deleted', list: updatedList });
    } catch (err) {
      return res.status(BAD_REQUEST).json({ message: err.toString() });
    }
  },
);

listRouter.delete(
  '/:listId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const listId = req.params.listId;
    const { user } = req;
    const expressUser = user as User;
    try {
      const listRecord = await listService.getListById(listId);
      if (listRecord === null || !listRecord)
        return res.status(NOT_FOUND).json({ message: 'List not found.' });
      const createdById = listRecord.createdBy?._id;
      console.log(createdById, typeof createdById);
      if (createdById.toString() !== expressUser._id)
        return res
          .status(BAD_REQUEST)
          .json({ message: 'Lists can only be deleted by the person who created them' });
      await listService.deleteList(listId);
      return res.status(OK).json({ message: 'List deleted' });
    } catch (err) {
      return res.status(BAD_REQUEST).json({ message: err.toString() });
    }
  },
);

listRouter.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const id = req.params.id;
  try {
    const listRecord = await listService.getListById(id);
    if (listRecord === null)
      return res.status(BAD_REQUEST).json({ message: 'List does not exist' });
    const { done, undone } = listService.separateListItems(listRecord);
    return res.status(OK).json({ list: listRecord, done, undone });
  } catch (err) {
    return res.status(BAD_REQUEST).json({ message: err.toString() });
  }
});

listRouter.get(
  '/list-item/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const id = req.params.id;
    try {
      const listItem = await listService.getListItemById(id);
      if (listItem === null)
        return res.status(BAD_REQUEST).json({ message: 'List-Item does not exist' });
      return res.status(OK).json(listItem);
    } catch (err) {
      return res.status(BAD_REQUEST).json({ message: err.toString() });
    }
  },
);

listRouter.post(
  `/:listId/done/:itemId`,
  passport.authenticate('jwt', { session: false }),
  validateDTO(UpdateListItemDto),
  async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const listItem = req.body as ListItem;
      const updatedItem = await listService.updateListItem(itemId, listItem);
      return res.status(OK).json(updatedItem);
    } catch (e) {
      return res
        .status(BAD_REQUEST)
        .json({ message: `There has been an error updating your list item`, error: e.toString() });
    }
  },
);

export default listRouter;
