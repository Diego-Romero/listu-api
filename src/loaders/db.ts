import Mongoose from 'mongoose';
import config from '../config/config';

Mongoose.connect('mongodb://localhost/listu', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'DB CONNECTION ERROR'));
db.on('open', function () {
  if (config.env !== 'test') {
    console.log('DB connected successfully');
  }
});
