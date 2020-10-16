import { default as express } from 'express';
import { Article } from '../types/article';
import initialiseDb from '../db';

// Returns an array of Articles as JSON
export async function getArticlesAsJSON(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  console.log(request.headers.accept);
  const accept = request.headers.accept || '*/*';
  if (accept.includes('application/json') || accept.includes('*/*')) {
    // todo: use some service -> repo
    const db = await initialiseDb('mongodb://root:password@localhost:27017', 'editor');
    const articles = db.collection('articles').find();
      response
      .type('application/json')
      .status(200)
      .json(articles);
  } else {
    next();
  }
}
