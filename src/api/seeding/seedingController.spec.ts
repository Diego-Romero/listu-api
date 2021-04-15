import { OK } from 'http-status';
import supertest from 'supertest';
import app from '../../app';
import setupDB from '../../loaders/test-setup';

const request = supertest(app);
setupDB('seeding');

describe('Seeding Controller', () => {
  test('Seed all', async (done) => {
    const response = await request.get('/seeding');
    expect(response.status).toBe(OK);
    done();
  });
});
