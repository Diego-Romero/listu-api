import { pick } from 'ramda';
import { List } from './models/list-model';
import { ListItem } from './models/ListItemModel';
import { User } from './models/userModel';

export interface FilteredUser {
  name: string;
  email: string;
  _id: string;
  lists: List[];
}

export function filterUserInReq(user: User): FilteredUser {
  return pick(['name', 'email', 'createdAt', 'lists', '_id'], user);
}
type DoneUndone = { done: ListItem[]; undone: ListItem[] };

export function separateListItems(list: List): DoneUndone {
  const done: ListItem[] = [];
  const undone: ListItem[] = [];

  for (const item of list.items) item.done ? done.push(item) : undone.push(item);

  return { done, undone };
}
