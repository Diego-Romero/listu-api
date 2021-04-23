import { CREATED, OK } from 'http-status';
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
  test('should be able to retrieve the list by id', async (done) => {
    const cookie = await getAuthCookie(request);
    const createListReq = await request
      .post('/lists')
      .send({
        name: 'testing',
        description: 'description',
      })
      .set('cookie', cookie);
    const listId = createListReq.body._id;
    const req = await request.get(`/lists/${listId}`).set('cookie', cookie);
    expect(req.status).toBe(OK);
    expect(req.body._id).toBe(listId);
    done();
  });
});
