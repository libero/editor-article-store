import { default as express } from 'express';
import { default as path } from 'path';
import { Article } from '../types/article';

// Route to ensure that the requested Article exists
export async function checkArticleExists(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  // // TODO: fix this later
  // if (!articleManager.has(request.params.articleId)) {
  //   response.sendStatus(404);
  // } else {
  //   next();
  // }
  next();
}

// Returns the Article as XML
export async function getArticleAsXML(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  const accept = request.headers.accept || '';
  if (accept.includes('application/xml')) {
    // const article = articleManager.get(request.params.articleId) as Article;
    response
      .type('application/xml')
      .status(200)
      .sendFile(path.resolve(''));
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
    // const article = articleManager.get(request.params.articleId) as Article;
    response
      .type('application/json')
      .status(200)
      .json('');
  } else {
    next();
  }
}
