import mongoose, { Document } from 'mongoose';
import { List } from './list-model';

export interface User extends Document {
  email: string;
  name: string;
  password?: string;
  lists: List[];
  resetPasswordToken?: string;
}

const schema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      maxlength: 100,
    },
    resetPasswordToken: {
      type: String,
      required: false,
      default: '',
    },
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
      },
    ],
  },
  { timestamps: true },
);

const UserModel = mongoose.model<User>('User', schema);

export default UserModel;
