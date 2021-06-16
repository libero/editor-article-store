import { Asset } from '../../../src/types/asset';
import { Db, MongoClient } from 'mongodb';
import assetRepository from '../../../src/repositories/assets';

const largeAssetCollection = (count = 101, mergeData?: Partial<Asset>) =>
    Array(count)
        .fill({
            assetId: '10000',
            articleId: 'articleId',
            fileName: 'someotherfile.tiff',
            created: new Date().toISOString(),
            ...mergeData,
        })
        .map((article, index) => ({ ...article, assetId: (Number(article.assetId) + index).toString() }));

describe('assetRepository', () => {
    let connection: MongoClient;
    let db: Db;

    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URL || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db();
    });

    beforeEach(async () => {
        await db.collection('assets').deleteMany({});
    });

    afterAll(async () => {
        await connection.close();
    });
    test('should not throw', () => {
        expect(() => {
            assetRepository(db);
        }).not.toThrow();
    });
    describe('insert', () => {
        test('insert should return id', async () => {
            const data: Asset = {
                assetId: 'assetid',
                articleId: 'articleid',
                fileName: 'main.tiff',
            };
            const insertedId = await assetRepository(db).insert(data);
            expect(insertedId).toBeDefined();
        });
        test('entry should exist in db after insert', async () => {
            const data: Asset = {
                assetId: 'assetid',
                articleId: 'articleid',
                fileName: 'main.tiff',
            };
            const insertedId = await assetRepository(db).insert(data);
            expect(insertedId).toBeDefined();
            await expect(db.collection('assets').findOne({ _id: insertedId })).resolves.toEqual(
                expect.objectContaining(data),
            );
        });
        test('entry should have a created value', async () => {
            const data: Asset = {
                assetId: 'assetid',
                articleId: 'articleid',
                fileName: 'main.tiff',
            };
            await assetRepository(db).insert(data);
            const asset = await db.collection('assets').findOne({ articleId: 'articleid' });
            expect(asset.created).toBeDefined();
        });
    });
    describe('getByArticleId', () => {
        test('returns assets with given ArticleId', async () => {
            await db.collection('assets').insertMany([
                {
                    assetId: 'assetid1',
                    articleId: 'articleId1',
                    fileName: 'somefile.tiff',
                    created: new Date().toISOString(),
                },
                {
                    assetId: 'assetid2',
                    articleId: 'articleId1',
                    fileName: 'someotherfile.tiff',
                    created: new Date().toISOString(),
                },
                {
                    assetId: 'assetid3',
                    articleId: 'articleId2',
                    fileName: 'somefile.tiff',
                    created: new Date().toISOString(),
                },
                {
                    assetId: 'assetid4',
                    articleId: 'articleId2',
                    fileName: 'someotherfile.tiff',
                    created: new Date().toISOString(),
                },
            ]);
            const assetCollection1 = await assetRepository(db).getByArticleId('articleId1');
            expect(assetCollection1.assets).toHaveLength(2);
            expect(assetCollection1.total).toBe(2);
            const assetCollection2 = await assetRepository(db).getByArticleId('articleId2');
            expect(assetCollection2.assets).toHaveLength(2);
            expect(assetCollection2.total).toBe(2);
            assetCollection1.assets.forEach((asset) => {
                expect(asset.articleId).toBe('articleId1');
            });
            assetCollection2.assets.forEach((asset) => {
                expect(asset.articleId).toBe('articleId2');
            });
        });
        test('it defaults to first 100 assets', async () => {
            await db.collection('assets').insertMany(largeAssetCollection());
            const returnedAssets = await assetRepository(db).getByArticleId('articleId');
            expect(returnedAssets.assets.length).toBe(100);
            expect(returnedAssets.total).toBe(101);
            expect(returnedAssets.assets[0].assetId).toBe('10000');
        });
        test('gets assets from given page of results', async () => {
            await db.collection('assets').insertMany(largeAssetCollection());
            const returnedAssets = await assetRepository(db).getByArticleId('articleId', 1);
            expect(returnedAssets.assets.length).toBe(1);
            expect(returnedAssets.total).toBe(101);
            expect(returnedAssets.assets[0].assetId).toBe('10100');
        });
    });
    describe('getByQuery', () => {
        it('returns given a query', async () => {
            await db.collection('assets').insertMany(largeAssetCollection(10, { articleId: 'foo' }));
            await db.collection('assets').insertMany(largeAssetCollection(10, { articleId: 'bar' }));
            await db.collection('assets').insertMany(largeAssetCollection(10, { articleId: 'bar', fileName: 'yyy' }));
            const returnedAssets1 = await assetRepository(db).getByQuery({ articleId: 'bar' });
            expect(returnedAssets1.assets.length).toBe(20);
            expect(returnedAssets1.total).toBe(20);
            const returnedAssets2 = await assetRepository(db).getByQuery({ articleId: 'bar', fileName: 'yyy' });
            expect(returnedAssets2.assets.length).toBe(10);
            expect(returnedAssets2.total).toBe(10);
        });
        test('it defaults to first 100 assets', async () => {
            await db.collection('assets').insertMany(largeAssetCollection());
            const returnedAssets = await assetRepository(db).getByQuery({});
            expect(returnedAssets.assets.length).toBe(100);
            expect(returnedAssets.total).toBe(101);
            expect(returnedAssets.assets[0].assetId).toBe('10000');
        });
        test('gets assets from given page of results', async () => {
            await db.collection('assets').insertMany(largeAssetCollection());
            const returnedAssets = await assetRepository(db).getByQuery({}, 1);
            expect(returnedAssets.assets.length).toBe(1);
            expect(returnedAssets.total).toBe(101);
            expect(returnedAssets.assets[0].assetId).toBe('10100');
        });
    });
});
