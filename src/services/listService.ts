import ListItemModel, { ListItem } from '../models/ListItemModel';
import ListModel, { List } from '../models/list-model';
import UserModel, { User } from '../models/userModel';
import { FilteredUser } from '../utils';

interface CreateListValues {
  name: string;
  description: string;
}
class ListService {
  async getListById(id: string): Promise<List | null> {
    return await ListModel.findById(id)
      .populate('users')
      .populate({
        path: 'items',
        populate: {
          path: 'createdBy',
        },
      })
      .populate('createdBy');
  }

  async getListItemById(id: string): Promise<ListItem | null> {
    return await ListItemModel.findById(id).populate('createdBy');
  }

  async createList(values: CreateListValues, user: FilteredUser): Promise<List> {
    const userRecord = (await UserModel.findById(user._id)) as User;
    const listValues = { createdBy: userRecord._id, users: [userRecord._id], ...values, items: [] };
    const newList = await ListModel.create(listValues);
    if (userRecord !== null) {
      userRecord.lists.push(newList._id);
      await userRecord.save();
    }
    return newList;
  }

  async createListItem(values: CreateListValues, user: User, listId: string): Promise<ListItem> {
    const listRecord = await ListModel.findById(listId);
    if (listRecord !== null) {
      const userId = user._id;
      const itemValues = { createdBy: userId, ...values };
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
}

export default ListService;
