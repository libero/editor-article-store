import { default as express } from 'express';
import { default as path } from 'path';
import { articleManager } from '../services/article-manager';
import { Article } from '../types/article';

// Route to ensure that the requested Article exists
export async function checkArticleExists(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  if (!articleManager.has(request.params.articleId)) {
    response.sendStatus(404);
  } else {
    next();
  }
}

// Returns the Article as XML
export async function getArticleAsXML(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  const accept = request.headers.accept || '';
  if (accept.includes('application/xml')) {
    const article = articleManager.get(request.params.articleId) as Article;
    response
      .type('application/xml')
      .status(200)
      .sendFile(path.resolve(article.xml));
  } else {
    next();
  }
}

// Returns the Article as JSON
export async function getArticleAsJSON(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  const accept = request.headers.accept || '*/*';
  if (accept.includes('application/json') || accept.includes('*/*')) {
    // FIXME: The object returned here should be reduced first.
    const article = articleManager.get(request.params.articleId) as Article;
    response
      .type('application/json')
      .status(200)
      .json(article);
  } else {
    next();
  }
}
