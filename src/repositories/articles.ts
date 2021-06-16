import { Db } from 'mongodb';
import { Article } from '../types/article';

const MAX_PAGE_SIZE = 50;

export type ArticleRepository = {
    insert: (article: Article) => Promise<string>;
    getByArticleId: (articleId: string) => Promise<Article>;
    get: (page?: number) => Promise<{ articles: Array<Article>; total: number }>;
};

export default async function articleRepository(db: Db): Promise<ArticleRepository> {
    const articleCollection = db.collection('articles');

    try {
        console.log('Creating articles indexes...');
        await articleCollection.createIndex(
            { articleId: 1 },
            {
                name: 'articleId',
            },
        );
    } catch (error) {
        throw new Error('Failed to create index for collection: articles - ' + error.message);
    }

    return {
        insert: async (article: Article) => {
            const { insertedId } = await articleCollection.insertOne({
                ...article,
                created: new Date().toISOString(),
            });
            return insertedId as string;
        },
        getByArticleId: async (articleId: string) => {
            const article = await articleCollection.findOne({ articleId });
            return article as Article;
        },
        get: async (page = 0) => {
            const skip = page * MAX_PAGE_SIZE;
            const articlesCursor = articleCollection.find().sort({ articleId: 1 }).skip(skip).limit(MAX_PAGE_SIZE);
            const articles = (await articlesCursor.toArray()) as Array<Article>;
            const total = await articlesCursor.count();
            return { articles, total };
        },
    };
}
