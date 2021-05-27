import ListItemModel, { ListItem } from '../models/ListItemModel';
import ListModel, { List } from '../models/list-model';
import UserModel, { User } from '../models/userModel';
import { FilteredUser } from '../utils';

interface CreateListValues {
  name: string;
  description: string;
}
class ListService {
  // async getListsWithItems(userId: string): Promise<List[]> {
  //   const user = await UserModel.findById(userId).populate({
  //     path: 'lists',
  //     populate: {
  //       path: 'createdBy',
  //     }
  //   })
  // }
  async getListById(id: string): Promise<List | null> {
    return await ListModel.findById(id)
      .populate('users')
      .populate({
        path: 'items',
        sort: { updatedAt: 'desc' },
        populate: {
          path: 'createdBy',
        },
      })
      .populate('createdBy');
  }

  separateListItems(list: List): { done: ListItem[]; undone: ListItem[] } {
    const done: ListItem[] = [];
    const undone: ListItem[] = [];

    for (const item of list.items) item.done ? done.push(item) : undone.push(item);

    return { done, undone };
  }

  async getListItemById(id: string): Promise<ListItem | null> {
    return await ListItemModel.findById(id).populate('createdBy');
  }

  async createList(values: CreateListValues, user: FilteredUser): Promise<List> {
    const userRecord = (await UserModel.findById(user._id)) as User;
    const listValues = { createdBy: userRecord._id, users: [userRecord._id], ...values, items: [] };
    let newList = await await ListModel.create(listValues);
    newList = await ListModel.populate(newList, [
      {
        path: 'users',
        model: 'User',
      },
      {
        path: 'createdBy',
        model: 'User',
      },
    ]);

    if (userRecord !== null) {
      userRecord.lists.push(newList._id);
      await userRecord.save();
    }
    return newList;
  }

  async updateList(values: CreateListValues, listId: string): Promise<List> {
    const listRecord = (await ListModel.findById(listId)) as List;
    listRecord.name = values.name;
    listRecord.description = values.description;
    await listRecord.save();
    return listRecord;
  }

  async createListItem(values: CreateListValues, user: User, listId: string): Promise<ListItem> {
    const listRecord = await ListModel.findById(listId);
    if (listRecord !== null) {
      const userId = user._id;
      const itemValues = { createdBy: userId, ...values, done: false };
      const newListItem = await ListItemModel.create(itemValues);
      listRecord.items.push(newListItem._id);
      await listRecord.save();
      return newListItem;
    }
    throw new Error('Unable to find the list');
  }

  async deleteListItem(listId: string, itemId: string): Promise<List | null> {
    await ListItemModel.findByIdAndRemove(itemId);
    const list = await ListModel.findByIdAndUpdate(listId, { $pull: { items: itemId } });
    return list;
  }

  async updateListItem(listItemId: string, listItem: ListItem): Promise<ListItem> {
    const listItemRecord = (await ListItemModel.findById(listItemId)) as ListItem;
    listItemRecord.name = listItem.name;
    listItemRecord.done = listItem.done;
    listItemRecord.description = listItem.description;
    await listItemRecord.save();
    return listItemRecord;
  }

  async deleteList(listId: string): Promise<void> {
    // need to remove the list from all the users
    const listRecord = (await ListModel.findById(listId).populate('users')) as List;
    for (const userInList of listRecord.users) {
      await UserModel.findByIdAndUpdate(userInList._id, {
        $pull: { lists: listId },
      });
    }
    await ListModel.findByIdAndDelete(listId);
  }

  async addUserToList(listRecord: List, userRecord: User): Promise<void> {
    listRecord.users.push(userRecord._id);
    await listRecord.save();
  }

  async updateListItemAttachmentUrl(id: string, url: string): Promise<ListItem | null> {
    const listItem = (await ListItemModel.findById(id)) as ListItem;
    listItem.attachmentUrl = url;
    listItem.save();
    return listItem;
  }
}

export default ListService;
