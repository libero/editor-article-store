import { Db, MongoClient } from 'mongodb';
import articleRepository from '../../../src/repositories/articles';
import { Article } from '../../../src/types/article';

const largeArticleCollection = Array(101)
    .fill({
        xml: '<xml></xml',
        datatype: 'xml',
        articleId: '10000',
        fileName: 'main.xml',
        version: 'v1',
    })
    .map((article, index) => ({ ...article, articleId: (Number(article.articleId) + index).toString() }));

describe('articleRepository', () => {
    let connection: MongoClient;
    let db: Db;

    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URL || '', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        db = await connection.db();
    });

    beforeEach(async () => {
        await db.collection('articles').deleteMany({});
    });

    afterAll(async () => {
        await connection.close();
    });
    test('should not throw', () => {
        expect(() => {
            articleRepository(db);
        }).not.toThrow();
    });

    test('Returns null if article is not found', async () => {
        const repo = await articleRepository(db);
        const result = await repo.getByArticleId('123');
        expect(result).toBe(null);
    });

    test('Returns article if found', async () => {
        const data = {
            xml: '<xml></xml',
            datatype: 'xml',
            articleId: '12345',
            fileName: 'main.xml',
        };
        const repo = await articleRepository(db);
        const { insertedId } = await db.collection('articles').insertOne(data);
        const result = await repo.getByArticleId('12345');
        expect(result).toBeDefined();
        expect(result).toEqual({ _id: insertedId, ...data });
    });

    test('Returns empty array if no articles', async () => {
        const repo = await articleRepository(db);
        const articles = await repo.get(0);
        expect(articles.total).toBe(0);
        expect(articles.articles).toHaveLength(0);
    });

    test('Returns article array if articles', async () => {
        const data = {
            xml: '<xml></xml',
            datatype: 'xml',
            articleId: '12345',
            fileName: 'main.xml',
            version: 'v1',
        };
        const repo = await articleRepository(db);
        const { insertedId } = await db.collection('articles').insertOne(data);
        const articles = await repo.get(0);
        expect(articles.total).toBe(1);
        expect(articles.articles[0]).toEqual({ _id: insertedId, ...data });
    });

    test('Returns array of all articles', async () => {
        const data = {
            xml: '<xml></xml',
            datatype: 'xml',
            articleId: '12345',
            fileName: 'main.xml',
            version: 'v1',
        };
        const repo = await articleRepository(db);
        const { insertedId } = await db.collection('articles').insertOne(data);
        const articles = await repo.get(0);
        expect(articles.total).toBe(1);
        expect(articles.articles[0]).toEqual({ _id: insertedId, ...data });
    });

    test('limits return to 100 per page', async () => {
        const repo = await articleRepository(db);
        await db.collection('articles').insertMany(largeArticleCollection);
        const returnedArticles = await repo.get(0);
        expect(returnedArticles.total).toBe(101);
        expect(returnedArticles.articles).toHaveLength(50);
        expect(returnedArticles.articles[0].articleId).toBe('10000');
        expect(returnedArticles.articles[49].articleId).toBe('10049');
    });

    test('gets first page by default', async () => {
        const repo = await articleRepository(db);
        await db.collection('articles').insertMany(largeArticleCollection);
        const returnedArticles = await repo.get();
        expect(returnedArticles.total).toBe(101);
        expect(returnedArticles.articles).toHaveLength(50);
        expect(returnedArticles.articles[0].articleId).toBe('10000');
        expect(returnedArticles.articles[49].articleId).toBe('10049');
    });
    test('gets specifid page', async () => {
        const repo = await articleRepository(db);
        await db.collection('articles').insertMany(largeArticleCollection);
        const returnedArticles1 = await repo.get(1);
        expect(returnedArticles1.total).toBe(101);
        expect(returnedArticles1.articles).toHaveLength(50);
        expect(returnedArticles1.articles[0].articleId).toBe('10050');
        expect(returnedArticles1.articles[49].articleId).toBe('10099');
        const returnedArticles2 = await repo.get(2);
        expect(returnedArticles2.total).toBe(101);
        expect(returnedArticles2.articles).toHaveLength(1);
        expect(returnedArticles2.articles[0].articleId).toBe('10100');
    });

    test('Inserting should return id', async () => {
        const data: Article = {
            xml: '<xml></xml',
            datatype: 'xml',
            articleId: '12345',
            fileName: 'main.xml',
            version: 'v1',
        };
        const repo = await articleRepository(db);
        const insertedId = await repo.insert(data);
        expect(insertedId).toBeDefined();
    });

    it('creates an index for articleId', async () => {
        await articleRepository(db);
        await expect(db.collection('articles').indexExists('articleId')).resolves.toBe(true);
        await expect(db.collection('articles').indexInformation()).resolves.toEqual({
            _id_: [['_id', 1]],
            articleId: [['articleId', 1]],
        });
    });
});
