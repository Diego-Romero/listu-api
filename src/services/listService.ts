import ListItemModel, { ListItem } from '../models/item-model';
import ListModel, { List } from '../models/list-model';
import UserModel, { User } from '../models/userModel';

interface CreateListValues {
  name: string;
  description: string;
}
class ListService {
  async getListById(id: string): Promise<List | null> {
    return await ListModel.findById(id).populate('users').populate('items');
  }

  async getListItemById(id: string): Promise<ListItem | null> {
    return await ListItemModel.findById(id).populate('createdBy');
  }

  async createList(values: CreateListValues, user: User): Promise<List> {
    const userId = user._id;
    const listValues = { createdBy: user._id, users: [user._id], ...values, items: [] };
    const newList = await ListModel.create(listValues);
    const userRecord = await UserModel.findById(userId);
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
}

export default ListService;
