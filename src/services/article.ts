import { Article } from "../types/article";
import { ArticleRepository } from '../repositories/articles';

export type ArticleService = {
  getArticles: (page: number) => Promise<Array<Article>>;
  findByArticleId: (articleId: string) => Promise<Article>;
}

export default (articleRepo: ArticleRepository): ArticleService => {
  return {
    getArticles: async (page: number) => {
      return articleRepo.get(page);
    },
    findByArticleId: async (articleId: string) => {
      return articleRepo.getByArticleId(articleId);
    }
  }
};