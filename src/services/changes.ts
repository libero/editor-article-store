import { Db } from 'mongodb';
import changeRepository from '../repositories/changes';

export default (db: Db) => {
  const changeRepo = changeRepository(db);
  return {
    // todo: do we need an optional filter for version number?
    getChangesforArticle: async (articleId: string, page: number) => {
      return changeRepo.get(articleId, page);
    },
    registerChange: async (change: any) => {
      return changeRepo.insert(change);
    }
  }
};