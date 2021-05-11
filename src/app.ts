import 'reflect-metadata';
import express, { Request, Response } from 'express';
import config from './config/config';
import './loaders/db';
import './loaders/passport';
import { setMiddleWare } from './loaders/middleware';
import userRouter from './api/user/userController';
import seedingRouter from './api/seeding/seedingController';
import listRouter from './api/lists/lists-controller';
import AWS from 'aws-sdk';

const app = express();
const port = config.port || 8080;

setMiddleWare(app);
AWS.config.update({
  accessKeyId: config.awsAccessKey,
  secretAccessKey: config.awsSecretAccessKey,
});

// health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'health check confirmed' });
});

// routes
app.use('/user', userRouter);
app.use('/seeding', seedingRouter);
app.use('/lists', listRouter);

// needed to be able to run tests in parallel
if (config.env !== 'test') {
  app.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
  });
}

export default app;
