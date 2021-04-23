import ListModel, { List } from '../models/list-model';
import UserModel, { User } from '../models/userModel';

interface CreateListValues {
  name: string;
  description: string;
}
class ListService {
  async createList(values: CreateListValues, user: User): Promise<List> {
    const userId = user._id;
    const listValues = { createdBy: user._id, users: [user._id], ...values };
    const newList = await ListModel.create(listValues);
    const userRecord = await UserModel.findById(userId);
    if (userRecord !== null) {
      userRecord.lists.push(newList._id);
      userRecord.save();
    }
    return newList;
  }
}

export default ListService;
