import * as request from 'supertest';

// move to enviroment;
const API_URL = 'localhost:8080';
const agent = request.agent(API_URL);

describe('Get /article/id', () => {
  test('Returns 404 if there are no changes', async () => {
    return agent
      .get('/articles/00000/changes')
      .expect(404);
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
});
