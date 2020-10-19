import { Db, ObjectID } from "mongodb";
import { Article } from "../types/article";

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
        .findOne({ articleId }); // TODO: use index on articleId
      return article; // TODO: add type
    },
    get: async() => {
      const articles = await db.collection('articles').find();
      return articles;
    }
  };
}
