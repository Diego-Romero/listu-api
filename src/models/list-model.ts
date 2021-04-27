import mongoose, { Document } from 'mongoose';
import { ListItem } from './item-model';

export interface List extends Document {
  description?: string;
  name: string;
  items: ListItem[];
  users?: string[];
  createdBy?: string;
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
      required: true,
      minlength: 2,
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
