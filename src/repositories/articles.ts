import { Db } from "mongodb";
import { Article } from "../types/article";

const MAX_PAGE_SIZE = 100;

export default function articleRepository(db: Db) {
  return {
    insert: async (article: Article) => {
      const { insertedId } = await db.collection("articles").insertOne({
        ...article,
      });
      return insertedId;
    },
    getByArticleId: async (articleId: string) => {
      const article = await db
        .collection("articles")
        .findOne({ articleId });
      return article;
    },
    get: async(page = 0) => {
      console.log('here we are');
      const skip = page * MAX_PAGE_SIZE;
      const articles = await db.collection('articles').find().skip(skip).limit(MAX_PAGE_SIZE).toArray();
      return articles;
    }
  };
}
