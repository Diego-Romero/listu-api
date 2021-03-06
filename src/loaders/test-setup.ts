// test-setup.js
import mongoose from 'mongoose';
import supertest from 'supertest';
import SeedingService from '../services/seedingService/seedingService';
import { seedingUserEmail, seedingUserPassword } from '../services/seedingService/user.seed';

export async function removeAllCollections(): Promise<void> {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
}

export async function dropAllCollections(): Promise<void> {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running')) return;
      console.log(error.message);
    }
  }
}

export async function getAuthCookie(request: supertest.SuperTest<supertest.Test>): Promise<string> {
  const seedingService = new SeedingService();
  await seedingService.seedUsers();
  const loginRes = await request.post(`/user/login`).send({
    email: seedingUserEmail,
    password: seedingUserPassword,
  });
  const setCookieString = loginRes.headers['set-cookie'];

  return setCookieString;
}

function setupDB(databaseName: string): void {
  let connection;
  beforeAll(async () => {
    const url = `mongodb://localhost/listu-test-${databaseName}`;
    connection = mongoose.createConnection(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  // Cleans up database between each test
  afterEach(async () => {
    await removeAllCollections();
  });

  // Disconnect Mongoose
  afterAll(async () => {
    await dropAllCollections();
    await connection.close();
  });
}

export default setupDB;
