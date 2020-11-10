import { Db, MongoClient } from "mongodb";
import changeRepository from "../../src/repositories/changes";

describe("changeRepository", () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL || "", {
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  beforeEach(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });
  test("should not throw", () => {
    expect(() => {
      changeRepository(db);
    }).not.toThrow();
  });

  test("should write change to the database", async () => {
    const repo = changeRepository(db);
    const change = {
      articleId: "1234",
      applied: false,
      user: 'static-for-now',
      steps: [
        {
          stepType: "replace",
          from: 121,
          to: 121,
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
    const insertedId = await repo.insert(change);
    const changeFromDb = await db
      .collection("changes")
      .findOne({ articleId: change.articleId });
    expect(insertedId).toBeDefined();
    expect({ ...change, _id: insertedId }).toEqual(changeFromDb);
  });

  test("should write change to the database", async () => {
    const repo = changeRepository(db);
    const change = {
      articleId: "1234",
      applied: false,
      user: 'static-for-now',
      steps: [
        {
          stepType: "replace",
          from: 121,
          to: 121,
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
    const insertedId = await repo.insert(change);
    expect(insertedId).toBeDefined();
    const changes = await repo.get("1234");
    expect([{ ...change, _id: insertedId }]).toEqual(changes);
  });
});
