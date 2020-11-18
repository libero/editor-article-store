import { Db } from "mongodb";
import { Change } from "../types/change";

const MAX_PAGE_SIZE = 100;

export default function changeRepository(db: Db) {
  return {
    insert: async (change: Change) => {
      const { insertedId } = await db.collection("changes").insertOne({
        ...change,
      });
      return insertedId as string;
    },
    get: async (articleId: string, page = 0) => {
      const skip = page * MAX_PAGE_SIZE;
      const changes = await db
        .collection("changes")
        .find({ articleId })
        .sort({ timestamp: 1 })
        .skip(skip)
        .limit(MAX_PAGE_SIZE)
        .toArray();
      return changes as Array<Change>;
    },
  };
}
