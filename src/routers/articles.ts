import { default as express } from 'express';
import { logRequest } from '../middlewares/log-request.js';

export const articlesRouter: express.Router = express.Router();

// Log all requests on this route.
articlesRouter.use(logRequest);

// Get a list of all the available articles.
articlesRouter.get('/', function(request: express.Request, response: express.Response) {
  response.sendStatus(501);
});

// Gets the specified article.
articlesRouter.get('/:articleId', function(request: express.Request, response: express.Response) {
  response.sendStatus(501);
});
