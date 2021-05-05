import { pick } from 'ramda';
import { User } from './models/userModel';

export interface FilteredUser {
  name: string;
  email: string;
  _id: string;
}

export function filterUserInReq(user: User): FilteredUser {
  return pick(['name', 'email', 'createdAt', 'lists', '_id'], user);
}
