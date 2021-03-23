import { Db } from "mongodb";
import { Article } from "../types/article";

const MAX_PAGE_SIZE = 100;

export type ArticleRepository = {
  insert: (article: Article) => Promise<string>;
  getByArticleId: (articleId: string) => Promise<Article>;
  get: (page?: number) => Promise<{ articles: Array<Article>, total: number }>
}

export default function articleRepository(db: Db): ArticleRepository {
  return {
    insert: async (article: Article) => {
      const { insertedId } = await db.collection("articles").insertOne({
        ...article,
        created: new Date().toISOString()
      });
      return insertedId as string;
    },
    getByArticleId: async (articleId: string) => {
      const article = await db
        .collection("articles")
        .findOne({ articleId });
      return article as Article;
    },
    get: async(page = 0) => {
      const skip = page * MAX_PAGE_SIZE;
      const articlesCursor = db.collection('articles').find() .sort({ created: 1 }).skip(skip).limit(MAX_PAGE_SIZE);
      const articles = await articlesCursor.toArray() as Array<Article>;
      const total = await articlesCursor.count();
      return { articles, total };
    }
  };
}
