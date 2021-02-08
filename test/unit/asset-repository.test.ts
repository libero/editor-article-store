import { Asset } from "../../src/types/asset";
import { Db, MongoClient } from "mongodb";
import assetRepository from "../../src/repositories/assets";

const largeAssetCollection = Array(101).fill({
  assetId: '10000',
  articleId: 'articleId',
  fileName: "someotherfile.tiff",
  created: new Date().toISOString()
}).map((article, index) => ({...article, assetId: (Number(article.assetId) + index).toString() }));


describe("assetRepository", () => {
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
      assetRepository(db);
    }).not.toThrow();
  });
  describe('insert', () => {
    test("insert should return id", async () => {
      const data: Asset = {
        assetId: 'assetid',
        articleId: "articleid",
        fileName: "main.tiff",
      };
      const insertedId = await assetRepository(db).insert(data);
      expect(insertedId).toBeDefined();
    });
    test("entry should exist in db after insert", async () => {
      const data: Asset = {
        assetId: 'assetid',
        articleId: "articleid",
        fileName: "main.tiff",
      };
      const insertedId = await assetRepository(db).insert(data);
      expect(insertedId).toBeDefined();
      await expect(db.collection("assets").findOne({ _id: insertedId })).resolves.toEqual(expect.objectContaining(data));
    });
    test("entry should have a created value", async () => {
      const data: Asset = {
        assetId: 'assetid',
        articleId: "articleid",
        fileName: "main.tiff",
      };
      await assetRepository(db).insert(data);
      const asset = await db.collection("assets").findOne({ articleId: "articleid" });
      expect(asset.created).toBeDefined();
    });
  });
  describe("getByArticleId", () => {
    test("returns assets with given ArticleId", async () => {
      await db.collection("assets").insertMany([
        {
          assetId: 'assetid1',
          articleId: 'articleId1',
          fileName: "somefile.tiff",
          created: new Date().toISOString()
        },
        {
          assetId: 'assetid2',
          articleId: 'articleId1',
          fileName: "someotherfile.tiff",
          created: new Date().toISOString()
        },
        {
          assetId: 'assetid3',
          articleId: 'articleId2',
          fileName: "somefile.tiff",
          created: new Date().toISOString()
        },
        {
          assetId: 'assetid4',
          articleId: 'articleId2',
          fileName: "someotherfile.tiff",
          created: new Date().toISOString()
        }
    ]);
      const assetCollection1 = await assetRepository(db).getByArticleId('articleId1');
      expect(assetCollection1).toHaveLength(2);
      const assetCollection2 = await assetRepository(db).getByArticleId('articleId2');
      expect(assetCollection2).toHaveLength(2);
      assetCollection1.forEach(asset => {
        expect(asset.articleId).toBe('articleId1');
      });
      assetCollection2.forEach(asset => {
        expect(asset.articleId).toBe('articleId2');
      });
    });
    test('it defaults to first 100 assets', async () => {
      await db.collection("assets").insertMany(largeAssetCollection);
      const returnedArticles = await assetRepository(db).getByArticleId('articleId');
      expect(returnedArticles.length).toBe(100);
      expect(returnedArticles[0].assetId).toBe("10000");
    });
    test("gets assets from given page of results", async () => {
      await db.collection("assets").insertMany(largeAssetCollection);
      const returnedArticles = await assetRepository(db).getByArticleId('articleId', 1);
      expect(returnedArticles.length).toBe(1);
      expect(returnedArticles[0].assetId).toBe("10100");
    })
  });
});