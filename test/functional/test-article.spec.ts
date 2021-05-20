import * as request from 'supertest';
import { clearCollections, populateCollection } from '../util/database-utils';
import completeArticle from './data/complete-article';
import completeChanges from './data/complete-changes';

// move to enviroment;
const API_URL = 'localhost:8080';
const agent = request.agent(API_URL);

const article = {
  xml: '<article><article-meta/><body/></article>',
  articleId: '54296',
  version: 'r1',
  datatype: "xml",
  fileName: 'elife-54296-vor-r1.xml',
};

describe('Get /article/id', () => {
  beforeEach(async () => {
    await clearCollections(['articles', 'changes', 'assets']);
  });
  
  it('Returns 404 for an invalid article', async () => {
    return agent
      .get('/article/00000')
      .set('Accept', 'application/json')
      .expect(404);
  });

  it('Can get an article as XML', async () => {
    await populateCollection('articles', [{...article}]);
    return agent
      .get('/articles/54296')
      .set('Accept', 'application/xml')
      .expect('Content-Type', /xml/)
      .expect(200)
      .then(response => {
        expect(response.text).toBe('<article><article-meta/><body/></article>');
    });
  });

  it('Can get an article as JSON', async () => {
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

  it('By default article is returned as JSON', async () => {
    await populateCollection('articles', [{...article}]);
    return agent
      .get('/articles/54296')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Can get article manifest', async () => {
    await populateCollection('articles', [{...article, xml: '<article><body><fig id="fig1" position="float"><graphic xlink:href="elife-54296-fig1.tif" mimetype="image" mime-subtype="tiff"/></fig></body></article>'}]);
    return agent
      .get('/articles/54296/manifest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({"articleId": "54296", "assets": [{"id": "fig1", "path": "http://localhost:8080/api/v1/articles/54296/assets/elife-54296-fig1.tif", "type": "image/jpeg"}], "path": "/api/v1/articles/54296/export", "type": ""});
    });
  });

  it('Returns 404 for an invalid article manifest', async () => {
    return agent
      .get('/articles/00000/manifest')
      .expect(404);
  });
});

describe('Get /article/id/export', () => {
  beforeEach(async () => {
    await clearCollections(['articles', 'changes', 'assets']);
  });

  it('exports an article with no changes as expected', async () => {
    await populateCollection('articles', [{...article}]);
    return agent
      .get('/articles/54296/export')
      .set('Accept', 'application/xml')
      .expect('Content-Type', /xml/)
      .expect(200)
      .then(response => {
        expect(response.text).toBe('<article><article-meta><contrib-group/><author-notes/><abstract><p/></abstract><abstract abstract-type="toc"><p/></abstract></article-meta><body><p/></body></article>')
      });
  });

  it('exports an article with changes applied', async () => {
    await populateCollection('articles', [{
      xml: '<article><article-meta><abstract><p>Hello World!</p></abstract></article-meta><body/></article>',
      articleId: '54296',
      version: 'r1',
      datatype: "xml",
      fileName: 'elife-54296-vor-r1.xml',
    }]);
    await populateCollection('changes', [{
        user: 'static-for-now',
        applied: false,
        articleId: "54296",
        path: "abstract",
        type: "prosemirror",
        timestamp: 1621508129485,
        transactionSteps: [
          {
            stepType: "replace",
            from: 14,
            to: 14,
            slice: {
              content: [
                {
                  type: "text",
                  text: "@123",
                },
              ],
            },
          },
        ],
      }
    ]);
    return agent
      .get('/articles/54296/export')
      .set('Accept', 'application/xml')
      .expect('Content-Type', /xml/)
      .expect(200)
      .then(response => {
        expect(response.text).toBe('<article><article-meta><contrib-group/><author-notes/><abstract><p>Hello World!@123</p></abstract><abstract abstract-type="toc"><p/></abstract></article-meta><body><p/></body></article>')
      });
  });

  it('exports a complete article with many changes applied', async () => {
    await populateCollection('articles', [completeArticle]);
    await populateCollection('changes', completeChanges);
    return agent
      .get('/articles/54296/export')
      .set('Accept', 'application/xml')
      .expect('Content-Type', /xml/)
      .expect(200)
      .then(response => {
        expect(response.text).toMatchSnapshot();
      });
  })
});
