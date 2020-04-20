import { default as express } from 'express';
import { articleManager } from '../services/article-manager.js';
import { Article } from '../types/article.js';

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
  if (request.headers.accept && request.header('Accept') === 'application/xml') {
    const article = articleManager.get(request.params.articleId) as Article;
    // FIXME: This isn't the best way to construct the file name, but will do for now...
    const fileName = `${article.root}/elife-${request.params.articleId}.xml`;
    response
      .type('application/json')
      .status(200)
      .sendFile(fileName, { root: process.cwd() });
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
  if (request.headers.accept && request.header('Accept') === 'application/json') {
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
