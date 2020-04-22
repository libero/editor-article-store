import { default as express } from 'express';
import { logRequest } from '../middlewares/log-request.js';
import { http415Response } from '../providers/errors.js';
import { getArticleAsJSON, getArticleAsXML, checkArticleExists } from '../providers/article.js';
import { getArticlesAsJSON } from '../providers/articles.js';

export const articlesRouter: express.Router = express.Router();

// Log all requests on this route.
articlesRouter.use(logRequest);

// Get a list of all the available articles.
articlesRouter.get('/', [getArticlesAsJSON, http415Response]);

// Gets the specified article.
articlesRouter.get('/:articleId', [checkArticleExists, getArticleAsXML, getArticleAsJSON, http415Response]);
