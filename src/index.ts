import { Http2Server } from 'http2';

import { default as express } from 'express';
import { articlesRouter } from './routers/articles.js';
import { changesRouter } from './routers/changes.js';

const app: express.Application = express();
const port: number = 8080;

// Register routers
app.use('/articles', articlesRouter);
app.use('/articles/:articleId/changes', changesRouter);

// Default handler
app.all('*', (request: express.Request, response: express.Response) => {
  response.sendStatus(404);
});

const server: Http2Server = app.listen(port, () => {
  // Make sure the application cleanly shuts down on SIGINT
  process.on('SIGINT', terminate);
  process.on('SIGTERM', terminate);

  console.log(`Server listening at http://localhost:${port}`);
});

// Cleanly shuts down the application
function terminate(): void {
  console.log(`Shutting down...`);
  server.close((error) => {
    process.exit(0);
  });
}
