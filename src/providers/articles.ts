import { default as express } from 'express';
import { articleManager } from '../services/article-manager.js';
import { Article } from '../types/article.js';

// Returns an array of Articles as JSON
export async function getArticlesAsJSON(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  console.log(request.headers.accept);
  const accept = request.headers.accept || '*/*';
  if (accept.includes('application/json') || accept.includes('*/*')) {
    // FIXME: The object returned here should be reduced first.
    const articles: Array<Article> = [...articleManager.values()];
    response
      .type('application/json')
      .status(200)
      .json(articles);
  } else {
    next();
  }
}
