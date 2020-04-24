import * as request from 'supertest';
import { app } from '../../dist/debug/server.js';
import { articleManager } from '../../dist/debug/services/article-manager.js';
import { loadArticlesFromPath } from '../../dist/debug/utils/article-utils';

const agent = request.agent(app);

describe('Get /article/00000', () => {
  beforeAll(async () => {
    await loadArticlesFromPath('./resources/articles', articleManager);
  });

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
});