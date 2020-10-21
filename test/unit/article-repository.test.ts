import { Db, MongoClient } from "mongodb";
import articleRepository from "../../src/repositories/articles";
import { Article } from "../../src/types/article";

describe("articleRepository", () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL || "", { useUnifiedTopology: true });
    db = await connection.db();
  });

  beforeEach(async () => {
    await db.dropDatabase();
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
    expect(articles.length).toBe(0);
  });

  test("Returns empty array if no articles", async () => {
    const data = {
      xml: "<xml></xml",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
      version: 'v1',
    };
    const { insertedId } = await db.collection("articles").insertOne(data);
    const articles = await articleRepository(db).get(0);
    expect(articles.length).toBe(1);
    expect(articles[0]).toEqual({ _id: insertedId, ...data });
  });

  test("Inserting should return id", async () => {
    const data: Article = {
      xml: "<xml></xml",
      datatype: "xml",
      articleId: "12345",
      fileName: "main.xml",
      version: 'v1',
    };
    const { insertedId } = await articleRepository(db).insert(data);
    const articles = await articleRepository(db).get(0);
    expect(insertedId).toBeDefined;
  });
});
