import * as request from 'supertest';
import { clearCollections, populateCollection } from '../util/database-utils';
import { clearBuckets, populateBucket } from '../util/assets-utils';

// move to enviroment;
const API_URL = 'localhost:8080';
const agent = request.agent(API_URL);

const article = {
    xml: '<article></article>',
    articleId: '54296',
    version: 'r1',
    datatype: 'xml',
    fileName: 'elife-54296-vor-r1.xml',
};

describe('Post /assets', () => {
    beforeEach(async () => {
        await clearCollections(['articles', 'changes', 'assets']);
        await clearBuckets(['editor']);
    });
    it('Should return 200 and asset key if file is uploaded', async () => {
        const buffer = Buffer.from('some file data');
        const resp = await agent
            .post('/articles/54296/assets')
            .set('content-type', 'multipart/form-data')
            .attach('file', buffer, 'custom_file_name.txt')
            .expect(200);
        expect(JSON.parse(resp.text).assetKey).toHaveLength(57);
    });
    it('Should return 400 if no file is uploaded', async () => {
        await agent.post('/articles/54296/assets').expect(400);
    });
});

describe('Get /assets', () => {
    beforeEach(async () => {
        await clearCollections(['articles', 'changes', 'assets']);
        await clearBuckets(['editor']);
    });
    it('Returns 404 for assets that are not found', async () => {
        await agent.get('/articles/00000/assets/1.jpg').set('Accept', 'application/json').expect(404);
    });

    it('Should return 302 for assets that are found', async () => {
        await populateCollection('articles', [{ ...article }]);
        await populateCollection('assets', [
            { fileName: 'elife-54296-fig1.tif', assetId: '0000-0000-0000-0000', articleId: '54296' },
        ]);
        await populateBucket('editor', '54296/0000-0000-0000-0000/elife-54296-fig1.tif', 'someContent');

        await agent.get('/articles/54296/assets/elife-54296-fig1.tif').set('Accept', 'application/json').expect(302);
    });

    it('Should return asset with uuid path or just fileName', async () => {
        await populateCollection('articles', [{ ...article }]);
        await populateCollection('assets', [
            { fileName: 'elife-54296-fig1.tif', assetId: '0000-0000-0000-0000', articleId: '54296' },
        ]);
        await populateBucket('editor', '54296/0000-0000-0000-0000/elife-54296-fig1.tif', 'someContent');

        const resp1 = await agent.get('/articles/54296/assets/0000-0000-0000-0000/elife-54296-fig1.tif').expect(302);

        const resp2 = await agent.get(`/articles/54296/assets/elife-54296-fig1.tif`).expect(302);

        expect(resp1.text).toContain(
            'Found. Redirecting to http://localhost:4566/editor/54296/0000-0000-0000-0000/elife-54296-fig1.tif',
        );
        expect(resp2.text).toContain(
            'Found. Redirecting to http://localhost:4566/editor/54296/0000-0000-0000-0000/elife-54296-fig1.tif',
        );
    });
});
