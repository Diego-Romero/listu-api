import mongoose, { Document } from 'mongoose';

export interface ListItem extends Document {
  description?: string;
  name: string;
  done: boolean;
  dateCompleted?: Date;
  attachmentUrl?: string;
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
      required: false,
      maxlength: 10000,
    },
    done: {
      type: Boolean,
      required: true,
      default: false,
    },
    attachmentUrl: {
      type: String,
      required: false,
    },
    dateCompleted: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const ListItemModel = mongoose.model<ListItem>('ListItem', schema);

export default ListItemModel;
