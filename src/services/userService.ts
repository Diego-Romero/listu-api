import UserModel, { User } from '../models/userModel';
import bcrypt from 'bcrypt';
import config from '../config/config';
import UserSignUpDto from '../dto/user/userSignUpDto';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, config.saltRounds);
}

class UserService {
  async register(user: UserSignUpDto): Promise<User> {
    const password = await hashPassword(user.password);
    const userRecord = await UserModel.create({ ...user, password, lists: [] });
    return userRecord;
  }

  async getUser(userId: string): Promise<User> {
    const userRecord = await UserModel.findById(userId).populate('lists');
    if (userRecord === null) throw new Error('User does not exists');
    return userRecord;
  }
}

export default UserService;
