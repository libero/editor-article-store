import { Article } from '../types/article';
import { ArticleManager } from '../types/article-manager';

class ArticleManagerInstance implements ArticleManager {
  private articles: Map<string, Article>;
  constructor() {
    this.articles = new Map();
  }

  add(article: Article): void {
    if (!this.articles.has(article.id)) {
      this.articles.set(article.id, article);
    }
  }

  get(articleId: string): Article | undefined {
    let retVal: Article | undefined = undefined;
    if (this.articles.has(articleId)) {
      retVal = this.articles.get(articleId);
    }
    return retVal;
  }

  has(articleId: string): boolean {
    return this.articles.has(articleId);
  }

  values(): Iterable<Article> {
    return this.articles.values();
  }
}

export const articleManager = new ArticleManagerInstance();
