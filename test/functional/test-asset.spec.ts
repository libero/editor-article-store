import * as request from 'supertest';

// move to enviroment;
const API_URL = 'localhost:8080';
const agent = request.agent(API_URL);

describe('Post /assets', () => {
  it('Should return 200 and asset key if file is uploaded', async () => {
    const buffer = Buffer.from('some file data');
    const resp = await agent
      .post("/articles/54296/assets")
      .set('content-type', 'multipart/form-data')
      .attach('file', buffer, 'custom_file_name.txt')
      .expect(200);
    expect(JSON.parse(resp.text).assetName).toHaveLength(57)
  });
  it('Should return 400 if no file is uploaded', async () => {
    await agent
    .post("/articles/54296/assets")
    .expect(400);
  });
});

describe('Get /assets', () => {
  test('Returns 404 for assets that are not found', async () => {
    await agent
      .get('/articles/00000/assets/1.jpg')
      .set('Accept', 'application/json')
      .expect(404);
  });

  test('Should return 302 for assets that are found - tiff', async () => {
    await agent
      .get('/articles/54296/assets/elife-54296-fig1.tif')
      .set('Accept', 'application/json')
      .expect(302);
  });

  test('Should return 302 for assets that are found - jpg', async () => {
    await agent
      .get('/articles/54296/assets/elife-54296-fig1.jpeg')
      .set('Accept', 'application/json')
      .expect(302);
  });

  test('Should return 302 for assets that are found - pdf', async () => {
    await agent
      .get('/articles/54296/assets/elife-54296.pdf')
      .set('Accept', 'application/json')
      .expect(302);
  });

  // prehaps this shouldn't be possible
  test('Should return 302 for assets that are found - xml', async () => {
     await agent
      .get('/articles/54296/assets/elife-54296.xml')
      .set('Accept', 'application/json')
      .expect(302);
  });

  test('Should return asset with uuid path or just fileName', async () => {
    const buffer = Buffer.from('some file data');
    const resp = await agent
      .post("/articles/54296/assets")
      .set('content-type', 'multipart/form-data')
      .attach('file', buffer, 'foo_file.txt')
    const assetName =JSON.parse(resp.text).assetName;
    expect(assetName).toBeDefined();

    const file1 = await agent
      .get(`/articles/54296/assets/${assetName}`)
      .set('Accept', 'application/json')
      .expect(302);

    const file2 = await agent
      .get(`/articles/54296/assets/foo_file.txt`)
      .set('Accept', 'application/json')
      .expect(302); 

    expect(file1).toEqual(file2);
  });
});
