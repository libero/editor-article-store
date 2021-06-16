import { Article, ArticleManifest } from '../types/article';
import { ArticleRepository } from '../repositories/articles';
import { getArticleManuscript } from '../xml-exporter/article-parser';
import { applyChangesToManuscript } from '../model/changes.utils';
import { ChangeRepository } from '../repositories/changes';
import { serializeManuscript } from '../xml-exporter/manuscript-serializer';
import { JSONObject } from '../model/types';
import { getAllFigureAssets } from '../model/utils';

export type ArticleService = {
    getArticles: (page: number) => Promise<{ articles: Array<Article>; total: number }>;
    findByArticleId: (articleId: string) => Promise<Article>;
    exportXml: (articleId: string) => Promise<string | null>;
    getManifest: (articleId: string) => Promise<ArticleManifest | null>;
};

export default (articleRepo: ArticleRepository, changesRepo: ChangeRepository): ArticleService => {
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
            const changes = (await changesRepo.getAllRawChanges(articleId)) as JSONObject[];
            manuscript = applyChangesToManuscript(manuscript, changes);
            return serializeManuscript(article, manuscript);
        },

        getManifest: async (articleId: string) => {
            const article = await articleRepo.getByArticleId(articleId);
            if (!article) {
                return null;
            }

            let manuscript = getArticleManuscript(article);
            const changes = (await changesRepo.getAllRawChanges(articleId)) as JSONObject[];
            manuscript = applyChangesToManuscript(manuscript, changes);

            const assets = Object.entries(getAllFigureAssets(manuscript)).map(([id, fileName]) => {
                return {
                    id,
                    type: 'image/jpeg',
                    path: `/api/v1/articles/${articleId}/assets/${fileName}`,
                };
            });

            return {
                articleId,
                type: manuscript.articleInfo.articleType,
                path: `/api/v1/articles/${articleId}/export`,
                assets,
            };
        },
    };
};
