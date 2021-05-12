import express from 'express';
import passport from 'passport';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status';
import CreateListDto from '../../dto/user/createListDto';
import CreateListItemDto from '../../dto/user/createListItemDto';
import validateDTO from '../../middleware/validateDto';
import { User } from '../../models/userModel';
import ListService from '../../services/listService';
import { FilteredUser } from '../../utils';
import UpdateListItemDto from '../../dto/user/updateListItemDto';
import { ListItem } from '../../models/ListItemModel';
import AWS from 'aws-sdk';
import config from '../../config/config';
import GetS3FileUploadUrlDTO from '../../dto/user/getS3FileUploadUrlDto';

const listRouter = express.Router();
const listService = new ListService();
AWS.config.update({
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretAccessKey,
});
const s3 = new AWS.S3({ signatureVersion: 'v4' });
const bucketName = `listu-${config.env}`;

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
    const listItem = await listService.getListItemById(itemId);
    if (listItem === null) {
      return res.status(BAD_REQUEST).json({ message: 'list item does not exist' });
    }
    try {
      if (listItem.attachmentUrl) {
        // todo: deleting old items if there is a different file extension is not working
        s3.deleteObject({ Bucket: bucketName, Key: listItem.attachmentUrl }, (err) => {
          if (err)
            return res.status(INTERNAL_SERVER_ERROR).json({
              message:
                'There has been an error deleting your previous attachment, please try again later',
            });
        });
      }
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

listRouter.post(
  `/:listId/:itemId/upload`,
  passport.authenticate('jwt', { session: false }),
  validateDTO(GetS3FileUploadUrlDTO),
  async (req, res) => {
    const expires = 60 * 10;
    const fileName = req.body.name;
    const listItemId = req.params.itemId;
    try {
      const listItem = await listService.getListItemById(listItemId);
      if (listItem === null) {
        return res.status(BAD_REQUEST).json({ message: 'list item does not exist' });
      }
      // if (listItem.attachmentUrl) {
      //   // todo: deleting old items if there is a different file extension is not working
      //   s3.deleteObject({ Bucket: bucketName, Key: listItem.attachmentUrl }, (err) => {
      //     if (err)
      //       return res.status(INTERNAL_SERVER_ERROR).json({
      //         message:
      //           'There has been an error deleting your previous attachment, please try again later',
      //       });
      //   });
      // }
      console.log(config);
      console.log('bucket', bucketName);
      console.log(fileName);
      console.log(expires);
      s3.getSignedUrl(
        'putObject',
        {
          Bucket: bucketName,
          Key: fileName,
          Expires: expires,
        },
        async (error, url) => {
          console.log(error, url);
          if (error)
            return res
              .status(500)
              .json({ message: 'There has been an error generating the url to upload the file.' });
          const objectUrl = `https://listu-${config.env}.s3.amazonaws.com/${fileName}`;
          const updated = await listService.updateListItemAttachmentUrl(
            req.params.itemId,
            objectUrl,
          );
          return res.status(OK).json({ url, item: updated });
        },
      );
    } catch (e) {
      return res
        .status(BAD_REQUEST)
        .json({ message: `There has been an error generating a url for your upload` });
    }
  },
);

export default listRouter;
