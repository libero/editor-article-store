import { default as cors } from 'cors';
import { default as express } from 'express';
import { articlesRouter } from './routers/articles.js';
import { changesRouter } from './routers/changes.js';
import { http404Response } from './providers/errors.js';

export const app: express.Application = express();

// Register middlewares
app.use(cors());

// Register routers
app.use('/articles', articlesRouter);
app.use('/articles/:articleId/changes', changesRouter);

// Register 'catch all' handler
app.all('*', http404Response);
