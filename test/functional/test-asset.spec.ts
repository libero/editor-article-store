import * as request from 'supertest';

// move to enviroment;
const API_URL = 'localhost:8080';
const agent = request.agent(API_URL);

describe('Get /assets', () => {
  test('Returns 404 for assets that are not found', async () => {
    return agent
      .get('/article/00000/assets/1.jpg')
      .set('Accept', 'application/json')
      .expect(404);
  });
});
