import { Db } from 'mongodb';

import { Article } from "../types/article";
import articleRepository from '../repositories/articles';

export type ArticleService = {
  getArticles: (page: number) => Promise<Array<Article>>;
  findByArticleId: (articleId: string) => Promise<Article>;
}

export default (db: Db): ArticleService => {
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