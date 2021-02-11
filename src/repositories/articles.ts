import { Db } from "mongodb";
import { Article } from "../types/article";

const MAX_PAGE_SIZE = 100;

export type ArticleRepository = {
  insert: (article: Article) => Promise<string>;
  getByArticleId: (articleId: string) => Promise<Article>;
  get: (page?: number) => Promise<Array<Article>>
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
      const articles = await db.collection('articles').find().skip(skip).limit(MAX_PAGE_SIZE).toArray();
      return articles as Array<Article>;
    }
  };
}
