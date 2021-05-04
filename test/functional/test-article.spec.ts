import * as request from 'supertest';

// move to enviroment;
const API_URL = 'localhost:8080';
const agent = request.agent(API_URL);

describe('Get /article/id', () => {
  test('Returns 404 for an invalid article', async () => {
    return agent
      .get('/article/00000')
      .set('Accept', 'application/json')
      .expect(404);
  });

  test('Can get an article as XML', async () => {
    return agent
      .get('/articles/54296')
      .set('Accept', 'application/xml')
      .expect('Content-Type', /xml/)
      .expect(200);
  });

  test('Can get an article as JSON', async () => {
    return agent
      .get('/articles/54296')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test('By default article is returned as JSON', async () => {
    return agent
      .get('/articles/54296')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test('Can get article manifest', async () => {
    return agent
      .get('/articles/54296/manifest')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test('Returns 404 for an invalid article manifest', async () => {
    return agent
      .get('/articles/00000/manifest')
      .expect(404);
  });
});
