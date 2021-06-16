import { Db } from 'mongodb';
import { Asset } from '../types/asset';

const MAX_PAGE_SIZE = 100;

export type AssetRepository = {
    insert: (asset: Asset) => Promise<string>;
    getByArticleId: (articleId: string, page?: number) => Promise<{ assets: Array<Asset>; total: number }>;
    getByQuery: (query: Partial<Asset>, page?: number) => Promise<{ assets: Array<Asset>; total: number }>;
};

export default function assetRepository(db: Db): AssetRepository {
    return {
        insert: async (asset: Asset) => {
            const { insertedId } = await db.collection('assets').insertOne({
                ...asset,
                created: new Date().toISOString(),
            });
            return insertedId as string;
        },
        getByArticleId: async function (articleId: string, page = 0) {
            return this.getByQuery({ articleId }, page);
        },
        getByQuery: async (query = {}, page = 0) => {
            const skip = page * MAX_PAGE_SIZE;
            const assetsCursor = await db.collection('assets').find(query).skip(skip).limit(MAX_PAGE_SIZE);
            const total = await assetsCursor.count();
            const assets = await assetsCursor.toArray();
            return { assets, total };
        },
    };
}
