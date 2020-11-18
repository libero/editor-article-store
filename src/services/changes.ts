import { Db } from 'mongodb';
import changeRepository from '../repositories/changes';
import { Change } from '../types/change';

export type ChangeService = {
  getChangesforArticle: (articleId: string, page?: number) => Promise<Array<Change>>;
  registerChange: (change: Change) => Promise<string>;
}

export default (db: Db): ChangeService => {
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