import { dropAllCollections } from '../../loaders/test-setup';
import UserModel from '../../models/userModel';
import seedUsers from './user.seed';

class SeedingService {
  async seedAll(): Promise<void> {
    await dropAllCollections();
    await this.seedUsers();
  }

  async seedUsers(): Promise<void> {
    const users = await seedUsers();
    await UserModel.insertMany(users);
  }
}

export default SeedingService;
