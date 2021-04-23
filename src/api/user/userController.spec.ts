import { CREATED, OK } from 'http-status';
import supertest from 'supertest';
import app from '../../app';
import setupDB, { getAuthCookie } from '../../loaders/test-setup';
import SeedingService from '../../services/seedingService/seedingService';
import { seedingUserEmail, seedingUserPassword } from '../../services/seedingService/user.seed';
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
    // todo: test should also check that it returns user in the body and the login cookie
    done();
  });

  test(`logs in`, async (done) => {
    await seedingService.seedUsers();
    const response = await request.post(`/user/login`).send({
      email: seedingUserEmail,
      password: seedingUserPassword,
    });
    // todo: test should also check that it returns user in the body and the login cookie
    expect(response.status).toBe(OK);
    done();
  });

  test('logs out', async (done) => {
    const cookie = await getAuthCookie(request);
    const response = await request.post(`/user/logout`).set('cookie', cookie);
    expect(response.status).toBe(OK);
    done();
  });

  test('me', async (done) => {
    const cookie = await getAuthCookie(request);
    const response = await request.get(`/user/me`).set('cookie', cookie);
    expect(response.status).toBe(OK);
    done();
  });
});
