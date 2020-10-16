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
    getById: async (id: string) => {
      const article = await db
        .collection("articles")
        .findOne({ _id: new ObjectID(id) });
      return article; // TODO: add type
    },
  };
}
