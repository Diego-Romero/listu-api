import { CREATED } from 'http-status';
import supertest from 'supertest';
import app from '../../app';
import setupDB, { getAuthCookie } from '../../loaders/test-setup';

const request = supertest(app);

setupDB('lists');
describe.only('List controller', () => {
  test('should create a new list record', async (done) => {
    const cookie = await getAuthCookie(request);
    const res = await request
      .post('/lists')
      .send({
        name: 'testing',
        description: 'description',
      })
      .set('cookie', cookie);
    expect(res.status).toBe(CREATED);
    done();
  });
});
