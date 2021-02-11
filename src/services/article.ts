import { Article } from "../types/article";
import { ArticleRepository } from '../repositories/articles';
import articleRepository from '../repositories/articles';
import {getArticleManuscript} from '../xml-exporter/article-parser';
import {applyChangesToManuscript} from '../model/changes.utils';
import changeRepository from "../repositories/changes";
import {JSONObject} from "../model/manuscript";
import {serializeManuscript} from "../xml-exporter/manuscript-serializer";

export type ArticleService = {
  getArticles: (page: number) => Promise<Array<Article>>;
  findByArticleId: (articleId: string) => Promise<Article>;
  exportXml: (articleId: string) => Promise<string | null>;
}

export default (articleRepo: ArticleRepository): ArticleService => {
  return {
    getArticles: (page: number) => {
      return articleRepo.get(page);
    },

    findByArticleId: (articleId: string) => {
      return articleRepo.getByArticleId(articleId);
    },

    exportXml: async (articleId: string): Promise<string | null> => {
      const article = await articleRepo.getByArticleId(articleId);
      if (!article) {
        return null;
      }

      let manuscript = getArticleManuscript(article);
      const changes = await changesRepo.getAllRawChanges(articleId) as JSONObject[];
      manuscript = applyChangesToManuscript(manuscript, changes);
      return serializeManuscript(article, manuscript);
    }
  }
};
