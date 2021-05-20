import * as request from "supertest";
import { clearCollections, populateCollection } from '../util/database-utils';

// move to enviroment;
const API_URL = "localhost:8080";
const agent = request.agent(API_URL);

const article = {
  xml: `<article>
    <article-meta>
      <abstract>
        <p>Hello World!</p>
      </abstract>
    </article-meta>
  </article>`,
  articleId: '54296',
  version: 'r1',
  datatype: "xml",
  fileName: 'elife-54296-vor-r1.xml',
};

const change = {
  user: 'static-for-now',
  applied: false,
  articleId: "54296",
  path: "abstract",
  timestamp: 1605198300275,
  steps: [
    {
      stepType: "replace",
      from: 5,
      to: 5,
      slice: {
        content: [
          {
            type: "text",
            text: "a",
          },
        ],
      },
    },
  ],
};

describe("Get /article/id/changes", () => {
  beforeEach(async () => {
    await clearCollections(['articles', 'changes', 'assets']);
  });
  test("Returns 404 if there are no changes", async () => {
    return agent.get("/articles/00000/changes").expect(404);
  });

  test("Returns 400 if post body is bad", async () => {
    await populateCollection('articles', [{...article}]);
    return agent
    .post("/articles/54296/changes")
    .send({})
    .expect(400)
  });

  test("Can get changes for an article", async () => {
    await populateCollection('articles', [{...article}]);
    await populateCollection('changes', [{...change}]);
    return agent
      .get("/articles/54296/changes")
      .expect("Content-Type", /json/)
      .then((response) => {
        const changes = response.body.changes;
        const { _id, created, ...rest } = changes[0];
        expect(changes.length).toBe(1);
        expect(rest).toEqual(change);
      });
  });

  test("Can post a change for an article", async () => {
    await populateCollection('articles', [{...article}]);
    return agent
      .post("/articles/54296/changes")
      .send({ changes: [change] })
      .expect(200)
      .then(() => 
        agent
          .get("/articles/54296/changes")
          .expect("Content-Type", /json/)
          .then((response) => {
            const changes = response.body.changes;
            const { _id, created, ...rest } = changes[0];
            expect(changes.length).toBe(1);
            expect(rest).toEqual(change);
          })
      );
  });
});
