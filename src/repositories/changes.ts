import { Db } from "mongodb";
import { Change } from "../types/change";
import {JSONObject} from "../model/types";

const MAX_PAGE_SIZE = 100;

export interface ChangesResultSet {
  changes: Array<Change>;
  total: number;
}

export type ChangeRepository = {
  insert: (change: Change) => Promise<string>;
  get: (articleId: string, page?: number) => Promise<ChangesResultSet>;
  getAllRawChanges: (articleId: string) => Promise<JSONObject[]>;
}

export default function changeRepository(db: Db): ChangeRepository {
  return {
    insert: async (change: Change) => {
      const { insertedId } = await db.collection("changes").insertOne({
        ...change,
        created: new Date().toISOString()
      });
      return insertedId as string;
    },
    get: async (articleId: string, page = 0) => {
      const skip = page * MAX_PAGE_SIZE;
      const changesCursor = db
        .collection("changes")
        .find({ articleId })
        .sort({ timestamp: 1 })
        .skip(skip)
        .limit(MAX_PAGE_SIZE);
      
      const changes = await changesCursor.toArray() as Array<Change>;
      const total = await changesCursor.count();

      return { changes, total };
    },

    getAllRawChanges: (articleId: string, page = 0) => {
      const changesCursor = db
        .collection("changes")
        .find({ articleId })
        .sort({ timestamp: 1 });

      return changesCursor.toArray() as Promise<JSONObject[]>;
    }
  };
}
