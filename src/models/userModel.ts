import mongoose, { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  name: string;
  password: string;
  id: string;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
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
      required: true,
      minlength: 4,
      maxlength: 100,
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
