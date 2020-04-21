import { Http2Server } from 'http2';

import { default as express } from 'express';
import { config } from './config/default.js';
import { articlesRouter } from './routers/articles.js';
import { changesRouter } from './routers/changes.js';
import { http404Response } from './providers/errors.js';
import { loadArticles } from './utils/article-loader.js';

const app: express.Application = express();
const port: number = 8080;
let server: Http2Server;

// Register routers
app.use('/articles', articlesRouter);
app.use('/articles/:articleId/changes', changesRouter);

// Default handler
app.all('*', http404Response);

loadArticles(config.articleRoot)
  .then(() => {
    server = app.listen(port, () => {
      // Make sure the application cleanly shuts down on SIGINT
      process.on('SIGINT', terminate);
      process.on('SIGTERM', terminate);

      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.log(error.message);
  });

// Cleanly shuts down the application
function terminate(): void {
  console.log(`Shutting down...`);
  if (server) {
    server.close((error) => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}
