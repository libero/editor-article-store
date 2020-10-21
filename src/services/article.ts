import { Db } from 'mongodb';
import articleRepository from '../repositories/articles';

export default (db: Db) => {
  const articleRepo = articleRepository(db);
  return {
    getArticles: async (page: number) => {
      return articleRepo.get(page);
    },
    findByArticleId: async (articleId: string) => {
      return articleRepo.getByArticleId(articleId);
    }
  }
};