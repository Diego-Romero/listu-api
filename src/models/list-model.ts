import mongoose, { Document } from 'mongoose';
import { ListItem } from './item-model';
import { User } from './userModel';

export interface List extends Document {
  description?: string;
  name: string;
  items: ListItem[];
  users: User[];
  createdBy?: User;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ListItem',
      },
    ],
  },
  { timestamps: true },
);

const ListModel = mongoose.model<List>('List', schema);

export default ListModel;
