import mongoose from 'mongoose';
import config from '../config/config';

const uri = config.dbConnection as string;

try {
  mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
    () => console.log('DB connected successfully'),
  );
} catch (e) {
  console.error(`Error connecting to the db`, e);
}
