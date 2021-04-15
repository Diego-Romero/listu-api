import { CREATED, OK } from 'http-status';
import supertest from 'supertest';
import app from '../../app';
import setupDB from '../../loaders/test-setup';
import SeedingService from '../../services/seedingService/seedingService';
import {
  seedingUserEmail,
  seedingUserPassword,
} from '../../services/seedingService/user.seed';
const request = supertest(app);

setupDB('user');
const seedingService = new SeedingService();

describe('User controller', () => {
  test(`registers`, async (done) => {
    const testEmail = `user_controller@mail.com`;
    const response = await request.post('/user/register').send({
      name: 'test',
      email: testEmail,
      password: 'password',
    });
    expect(response.status).toBe(CREATED);
    done();
  });

  test(`logs in`, async (done) => {
    await seedingService.seedUsers();
    const response = await request.post(`/user/login`).send({
      email: seedingUserEmail,
      password: seedingUserPassword,
    });
    expect(response.status).toBe(OK);
    done();
  });

  test('logs out', async (done) => {
    await seedingService.seedUsers();
    await request.post(`/user/login`).send({
      email: seedingUserEmail,
      password: seedingUserPassword,
    });
    const response = await request.post(`/user/logout`);
    expect(response.status).toBe(OK);
    done();
  });

  test('me', async (done) => {
    await seedingService.seedUsers();
    const loginRes = await request.post(`/user/login`).send({
      email: seedingUserEmail,
      password: seedingUserPassword,
    });
    const cookie = loginRes.headers['set-cookie'];
    const response = await request
      .get(`/user/me`)
      .set('cookie', cookie);
    expect(response.status).toBe(OK);
    done();
  });
});
