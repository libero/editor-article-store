import { Db, MongoClient } from "mongodb";
import articleService from "../../src/services/article";

describe("articleService", () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL || '');
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });
  test("It should not throw", () => {
    expect(() => {
      articleService(db);
    }).not.toThrow();
  });
});
