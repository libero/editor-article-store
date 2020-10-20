import * as request from 'supertest';
import startServer from '../../src/server';

const agent = request.agent(startServer());

describe('Get /articles', () => {
  test('Returns 200 for a valid mimetype', async () => {
    return agent
      .get('/articles')
      .set('Accept', 'application/json')
      .expect(200)
      .expect((response) => {
        Array.isArray(response.body);
        response.body.length === 0;
      });
  });

  test('Returns 415 for an invalid mimetype', async () => {
    return agent
      .get('/articles')
      .set('Accept', 'application/xml')
      .expect(415);
  });
});
