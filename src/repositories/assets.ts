import { Db } from "mongodb";
import { Asset } from "../types/asset";

const MAX_PAGE_SIZE = 100;

export type AssetRepository = {
  insert: (asset: Asset) => Promise<string>;
  getByArticleId: (articleId: string, page?: number) => Promise<Array<Asset>>;
}

export default function assetRepository(db: Db): AssetRepository {
  return {
    insert: async (asset: Asset) => {
      const { insertedId } = await db.collection("assets").insertOne({
        ...asset,
        created: new Date().toISOString()
      });
      return insertedId as string;
    },
    getByArticleId: async (articleId: string, page = 0) => {
      const skip = page * MAX_PAGE_SIZE;
      const assets = await db.collection('assets').find({ articleId}).skip(skip).limit(MAX_PAGE_SIZE).toArray();
      return assets as Array<Asset>;
    }
  };
}
