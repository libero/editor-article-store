import { Db } from 'mongodb';
import changeRepository from '../repositories/changes';
import { Change } from '../types/change';

export default (db: Db) => {
  const changeRepo = changeRepository(db);
  return {
    // todo: do we need an optional filter for version number?
    getChangesforArticle: async (articleId: string, page = 0) => {
      return changeRepo.get(articleId, page);
    },
    registerChange: async (change: Change) => {
      return changeRepo.insert(change);
    }
  }
};