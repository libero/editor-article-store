import * as request from 'supertest';

// move to enviroment;
const API_URL = 'localhost:8080';
const agent = request.agent(API_URL);

describe('Get /assets', () => {
  test('Returns 404 for assets that are not found', async () => {
    return agent
      .get('/articles/00000/assets/1.jpg')
      .set('Accept', 'application/json')
      .expect(404);
  });

  test('Should return 301 for assets that are found - tiff', async () => {
    return agent
      .get('/articles/54296/assets/elife-54296-fig1.tif')
      .set('Accept', 'application/json')
      .expect(301);
  });

  test('Should return 301 for assets that are found - jpg', async () => {
    return agent
      .get('/articles/54296/assets/elife-54296-fig1.jpg')
      .set('Accept', 'application/json')
      .expect(301);
  });

  test('Should return 301 for assets that are found - pdf', async () => {
    return agent
      .get('/articles/54296/assets/elife-54296.pdf')
      .set('Accept', 'application/json')
      .expect(301);
  });

  // perphas this shouldn't be possible
  test('Should return 301 for assets that are found - xml', async () => {
    return agent
      .get('/articles/54296/assets/elife-54296.xml')
      .set('Accept', 'application/json')
      .expect(301);
  });
});
