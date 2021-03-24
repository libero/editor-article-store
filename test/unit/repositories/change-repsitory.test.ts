import { Change } from "../../../src/types/change";
import { Db, MongoClient } from "mongodb";
import changeRepository from "../../../src/repositories/changes";

describe("changeRepository", () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  beforeEach(async () => {
    await db.collection('changes').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });
  test("should not throw", () => {
    expect(() => {
      changeRepository(db);
    }).not.toThrow();
  });

  it("should write change to the database", async () => {
    const repo = await changeRepository(db);
    const change: Change = {
      articleId: "1234",
      applied: false,
      type: 'steps',
      user: 'static-for-now',
      path: 'abstract',
      timestamp: 1605198300275,
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
    const changeFromDb = await db
      .collection("changes")
      .findOne({ articleId: change.articleId });
    delete changeFromDb.created;
    expect(changeFromDb).toMatchObject({ ...change, _id: insertedId });
  });

  it("should write change to the database", async () => {
    const repo = await changeRepository(db);
    const change: Change = {
      articleId: "1234",
      applied: false,
      type: 'steps',
      path: 'abstract',
      user: 'static-for-now',
      timestamp: 1605198300275,
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
    changes.changes.forEach(element => delete element.created)
    expect(changes).toStrictEqual(expect.objectContaining({ total: 1, changes: [{ ...change, _id: insertedId }] }));
  });

  it('creates an index for articleId', async () => {
    await changeRepository(db);
    await expect(db.collection('changes').indexExists('articleId')).resolves.toBe(true);
    await expect(db.collection('changes').indexInformation()).resolves.toEqual({"_id_": [["_id", 1]], "articleId": [["articleId", 1]]});
  });
});
