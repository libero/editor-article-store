import { Article } from './article';

export interface ArticleManager {
    add(article: Article): void;
    get(articleId: string): Article | undefined;
    has(articleId: string): boolean;
    values(): Iterable<Article>;
}
