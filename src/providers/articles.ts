import { default as express } from 'express';
import initialiseDb from '../db';
import articleRepository from '../repositories/articles';

// Returns an array of Articles as JSON
export async function getArticlesAsJSON(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  console.log(request.headers.accept);
  const accept = request.headers.accept || '*/*';
  if (accept.includes('application/json') || accept.includes('*/*')) {
    // todo: address as part of the depedency injection work
    // todo: add paging and limits
    const db = await initialiseDb('mongodb://root:password@localhost:27017', 'editor');
    const repo = articleRepository(db);
    const articles = await repo.get();
      response
      .type('application/json')
      .status(200)
      .json(articles);
  } else {
    next();
  }
}
