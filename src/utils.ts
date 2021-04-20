import { pick } from 'ramda';
import { User } from './models/userModel';

interface FilteredUser {
  name: string;
  email: string;
}

export function filterUserInReq(user: User): FilteredUser {
  return pick(['name', 'email'], user);
}
