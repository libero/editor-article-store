import * as request from 'supertest';

// move to enviroment;
const API_URL = 'localhost:8080';
const agent = request.agent(API_URL);

describe('Get /assets', () => {
  test('Returns 404 for assets that are not found', async () => {
    await agent
      .get('/articles/00000/assets/1.jpg')
      .set('Accept', 'application/json')
      .expect(404);
  });

  test.only('Should return 301 for assets that are found - tiff', async () => {
    await agent
      .get('/articles/54296/assets/elife-54296-fig1.tif')
      .set('Accept', 'application/json')
      .expect(301);
  });

  test('Should return 301 for assets that are found - jpg', async () => {
    await agent
      .get('/articles/54296/assets/elife-54296-fig1.jpg')
      .set('Accept', 'application/json')
      .expect(301);
  });

  test('Should return 301 for assets that are found - pdf', async () => {
    await agent
      .get('/articles/54296/assets/elife-54296.pdf')
      .set('Accept', 'application/json')
      .expect(301);
  });

  // perphas this shouldn't be possible
  test('Should return 301 for assets that are found - xml', async () => {
     await agent
      .get('/articles/54296/assets/elife-54296.xml')
      .set('Accept', 'application/json')
      .expect(301);
  });
});

describe('Post /assets', () => {
  it('Should return 200 if asset is uploaded', async () => {
    const buffer = Buffer.from('some file data');
    await agent
    .post("/articles/54296/assets")
    .set('content-type', 'multipart/form-data')
    .attach('file', buffer, 'custom_file_name.txt')
    .expect(200);
  });
});
