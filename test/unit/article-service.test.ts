import { Db, MongoClient } from "mongodb";
import articleService from "../../src/services/article";

describe("articleService", () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL || "");
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });
  test("should not throw", () => {
    expect(() => {
      articleService(db);
    }).not.toThrow();
  });

  test("Returns null if article is not found", async () => {
    const result = await articleService(db).findByArticleId("123");
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
    const result = await articleService(db).findByArticleId("12345");
    expect(result).toBeDefined();
    expect(result).toEqual({ _id: insertedId, ...data });
  });
});
