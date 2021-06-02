import UserModel, { User } from '../models/userModel';
import bcrypt from 'bcrypt';
import config from '../config/config';
import UserSignUpDto from '../dto/user/userSignUpDto';
import { List } from '../models/list-model';
import RegisterFriendDTO from '../dto/user/registerFriendDto';
import ListService from './listService';
import { FilteredUser } from '../utils';
import ListItemModel from '../models/ListItemModel';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, config.saltRounds);
}

const listService = new ListService();

class UserService {
  async register(user: UserSignUpDto): Promise<User> {
    const password = await hashPassword(user.password);
    const userRecord = await UserModel.create({ ...user, password, lists: [] });
    return userRecord;
  }

  async createExampleListsForNewUser(user: User): Promise<void> {
    const defaultList = await listService.createList(
      {
        name: 'A list example',
        description: 'You can also invite friends to share this list with you',
      },
      user as FilteredUser,
    );
    const userId = user._id;
    const item1Values = {
      createdBy: userId,
      name: 'type in the input above to create a new item',
      done: false,
    };
    const item1 = await ListItemModel.create(item1Values);
    const item2Values = {
      createdBy: userId,
      name: 'or press space to create a new item',
      done: false,
    };
    const item2 = await ListItemModel.create(item2Values);
    const item3Values = {
      createdBy: userId,
      name: 'You can move the items around to sort them',
      done: false,
    };
    const item3 = await ListItemModel.create(item3Values);
    const item4Values = {
      createdBy: userId,
      name: 'Click on the item to edit it',
      done: false,
    };
    const item4 = await ListItemModel.create(item4Values);
    const item5Values = {
      createdBy: userId,
      name: 'You can also attach an image to each item',
      done: false,
    };
    const item5 = await ListItemModel.create(item5Values);
    const item6Values = {
      createdBy: userId,
      name: 'Mark as done by clicking on the green tick',
      done: false,
    };
    const item6 = await ListItemModel.create(item6Values);
    const item7Values = {
      createdBy: userId,
      name: 'Delete item by clicking on the red cross',
      done: true,
    };
    const item7 = await ListItemModel.create(item7Values);
    const item8Values = {
      createdBy: userId,
      name: 'Return done items by clicking on them',
      done: true,
    };
    const item8 = await ListItemModel.create(item8Values);

    defaultList.items.push(item1);
    defaultList.items.push(item2);
    defaultList.items.push(item3);
    defaultList.items.push(item4);
    defaultList.items.push(item5);
    defaultList.items.push(item6);
    defaultList.items.push(item7);
    defaultList.items.push(item8);

    defaultList.save();
    await listService.createList(
      {
        name: 'Click on pencil to delete lists',
        description: 'You can include a description on your lists too!',
      },
      user as FilteredUser,
    );
  }

  async registerFriend(user: RegisterFriendDTO, id: string): Promise<User> {
    const password = await hashPassword(user.password);
    const userRecord = (await UserModel.findById(id)) as User;
    userRecord.password = password;
    userRecord.name = user.name;
    await userRecord.save();
    return userRecord;
  }

  async createUserFromEmail(email: string): Promise<User> {
    let userRecord = await UserModel.create({ email, lists: [], name: '' });
    userRecord = await userRecord.populate('lists').execPopulate();
    return userRecord;
  }

  async getUser(userId: string): Promise<User | null> {
    const userRecord = await UserModel.findById(userId).populate({
      path: 'lists',
      model: 'List',
      populate: [
        {
          path: 'items',
          model: 'ListItem',
        },
        {
          path: 'users',
          model: 'User',
        },
        {
          path: 'createdBy',
          model: 'User',
        },
      ],
    });
    return userRecord;
  }

  async getUserFromEmail(email: string): Promise<User | null> {
    const userRecord = await UserModel.findOne({ email }).populate('lists');
    return userRecord;
  }

  async resetUserPassword(newPassword: string, userId: string): Promise<User> {
    const userRecord = (await UserModel.findById(userId)) as User;
    const password = await hashPassword(newPassword);
    userRecord.password = password;
    userRecord.resetPasswordToken = '';
    await userRecord.save();
    return userRecord;
  }

  async getUserByPasswordResetToken(token: string): Promise<User | null> {
    const userRecord = await UserModel.findOne({ resetPasswordToken: token }).populate('lists');
    return userRecord;
  }

  async addListToUserLists(listRecord: List, userRecord: User): Promise<void> {
    userRecord.lists.push(listRecord);
    await userRecord.save();
  }
}

export default UserService;
