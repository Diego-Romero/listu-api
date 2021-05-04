import UserModel, { User } from '../models/userModel';
import bcrypt from 'bcrypt';
import config from '../config/config';
import UserSignUpDto from '../dto/user/userSignUpDto';
import { List } from '../models/list-model';
import RegisterFriendDTO from '../dto/user/registerFriendDto';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, config.saltRounds);
}

class UserService {
  async register(user: UserSignUpDto): Promise<User> {
    const password = await hashPassword(user.password);
    const userRecord = await UserModel.create({ ...user, password, lists: [] });
    return userRecord;
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
      populate: {
        path: 'createdBy',
      },
    });
    return userRecord;
  }

  async getUserFromEmail(email: string): Promise<User | null> {
    const userRecord = await UserModel.findOne({ email }).populate('lists');
    return userRecord;
  }

  async addListToUserLists(listRecord: List, userRecord: User): Promise<void> {
    userRecord.lists.push(listRecord);
    await userRecord.save();
  }
}

export default UserService;
