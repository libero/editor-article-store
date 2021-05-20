import * as request from 'supertest';
import { clearCollections, populateCollection } from '../util/database-utils';

// move to enviroment;
const API_URL = 'localhost:8080';
const agent = request.agent(API_URL);

const article = {
  xml: '<article></article>',
  articleId: '54296',
  version: 'r1',
  datatype: "xml",
  fileName: 'elife-54296-vor-r1.xml',
};

describe('Get /article/id', () => {
  beforeEach(async () => {
    await clearCollections(['articles', 'changes', 'assets']);
  });
  
  test('Returns 404 for an invalid article', async () => {
    return agent
      .get('/article/00000')
      .set('Accept', 'application/json')
      .expect(404);
  });

  test('Can get an article as XML', async () => {
    await populateCollection('articles', [{...article}]);
    return agent
      .get('/articles/54296')
      .set('Accept', 'application/xml')
      .expect('Content-Type', /xml/)
      .expect(200)
      .then(response => {
        expect(response.text).toBe('<article></article>');
    });
  });

  test('Can get an article as JSON', async () => {
    await populateCollection('articles', [{...article}]);
    return agent
      .get('/articles/54296')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(expect.objectContaining(article));
    });
  });

  test('By default article is returned as JSON', async () => {
    await populateCollection('articles', [{...article}]);
    return agent
      .get('/articles/54296')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test('Can get article manifest', async () => {
    await populateCollection('articles', [{...article, xml: '<article><body><fig id="fig1" position="float"><graphic xlink:href="elife-54296-fig1.tif" mimetype="image" mime-subtype="tiff"/></fig></body></article>'}]);
    return agent
      .get('/articles/54296/manifest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({"articleId": "54296", "assets": [{"id": "fig1", "path": "http://localhost:8080/api/v1/articles/54296/assets/elife-54296-fig1.tif", "type": "image/jpeg"}], "path": "/api/v1/articles/54296/export", "type": ""});
    });
  });

  test('Returns 404 for an invalid article manifest', async () => {
    return agent
      .get('/articles/00000/manifest')
      .expect(404);
  });
});
