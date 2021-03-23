import { Db, MongoClient } from "mongodb";
import articleRepository from "../../../src/repositories/articles";
import { Article } from "../../../src/types/article";

const largeArticleCollection = Array(101).fill({
  xml: "<xml></xml",
  datatype: "xml",
  articleId: "10000",
  fileName: "main.xml",
  version: 'v1',
}).map((article, index) => ({...article, articleId: (Number(article.articleId) + index).toString() }));

describe("articleRepository", () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL || "", { useUnifiedTopology: true, useNewUrlParser: true });
    db = await connection.db();
  });

  beforeEach(async () => {
    await db.collection('articles').deleteMany({});
  })

  afterAll(async () => {
    await connection.close();
  });
  test("should not throw", () => {
    expect(() => {
      articleRepository(db);
    }).not.toThrow();
  });

  test("Returns null if article is not found", async () => {
    const result = await articleRepository(db).getByArticleId("123");
    expect(result).toBe(null);
  });

  test("Returns article if found", async () => {
    const data = {
      xml: "<xml></xml",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
    };
    const { insertedId } = await db.collection("articles").insertOne(data);
    const result = await articleRepository(db).getByArticleId("12345");
    expect(result).toBeDefined();
    expect(result).toEqual({ _id: insertedId, ...data });
  });

  test("Returns empty array if no articles", async () => {
    const articles = await articleRepository(db).get(0);
    expect(articles.total).toBe(0);
    expect(articles.articles).toHaveLength(0);
  });

  test("Returns article array if articles", async () => {
    const data = {
      xml: "<xml></xml",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
      version: 'v1',
    };
    const { insertedId } = await db.collection("articles").insertOne(data);
    const articles = await articleRepository(db).get(0);
    expect(articles.total).toBe(1);
    expect(articles.articles[0]).toEqual({ _id: insertedId, ...data });
  });

  test("Returns array of all articles", async () => {
    const data = {
      xml: "<xml></xml",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
      version: 'v1',
    };
    const { insertedId } = await db.collection("articles").insertOne(data);
    const articles = await articleRepository(db).get(0);
    expect(articles.total).toBe(1);
    expect(articles.articles[0]).toEqual({ _id: insertedId, ...data });
  });

  test("limits return to 100 per page", async () => {
    await db.collection("articles").insertMany(largeArticleCollection);
    const returnedArticles = await articleRepository(db).get(0);
    expect(returnedArticles.total).toBe(101);
    expect(returnedArticles.articles).toHaveLength(50);
    expect(returnedArticles.articles[0].articleId).toBe("10000");
    expect(returnedArticles.articles[49].articleId).toBe("10049");
  });

  test("gets first page by default", async () => {
    await db.collection("articles").insertMany(largeArticleCollection);
    const returnedArticles = await articleRepository(db).get();
    expect(returnedArticles.total).toBe(101);
    expect(returnedArticles.articles).toHaveLength(50);
    expect(returnedArticles.articles[0].articleId).toBe("10000");
    expect(returnedArticles.articles[49].articleId).toBe("10049");
  })
  test("gets specifid page", async () => {
    await db.collection("articles").insertMany(largeArticleCollection);
    const returnedArticles1 = await articleRepository(db).get(1);
    expect(returnedArticles1.total).toBe(101);
    expect(returnedArticles1.articles).toHaveLength(50);
    expect(returnedArticles1.articles[0].articleId).toBe("10050");
    expect(returnedArticles1.articles[49].articleId).toBe("10099");
    const returnedArticles2 = await articleRepository(db).get(2);
    expect(returnedArticles2.total).toBe(101);
    expect(returnedArticles2.articles).toHaveLength(1);
    expect(returnedArticles2.articles[0].articleId).toBe("10100");
  })

  test("Inserting should return id", async () => {
    const data: Article = {
      xml: "<xml></xml",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
      version: 'v1',
    };
    const insertedId = await articleRepository(db).insert(data);
    expect(insertedId).toBeDefined();
  });
});
