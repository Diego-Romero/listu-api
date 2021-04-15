import UserModel, { User } from '../models/userModel';
import bcrypt from 'bcrypt';
import config from '../config/config';
import UserSignUpDto from '../dto/user/userSignUpDto';

export async function hashPassword(
  password: string,
): Promise<string> {
  return await bcrypt.hash(password, config.saltRounds);
}

class UserService {
  async register(user: UserSignUpDto): Promise<User> {
    const password = await hashPassword(user.password);
    const userRecord = await UserModel.create({ ...user, password });
    return userRecord;
  }
}

export default UserService;
