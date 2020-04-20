import { default as express } from 'express';
import { articleManager } from '../services/article-manager.js';
import { Article } from '../types/article.js';

// Returns an array of Articles as JSON
export async function getArticlesAsJSON(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  if (request.headers.accept && request.header('Accept') === 'application/json') {
    // FIXME: The object returned here should be reduced first.
    const articles: Array<Article> = [];
    for (const article of articleManager.values()) {
      articles.push(article);
    }

    response
      .type('application/json')
      .status(200)
      .json(articles);
  } else {
    next();
  }
}
