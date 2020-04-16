import { default as express } from 'express';
import { Http2Server } from 'http2';

const app: express.Application = express();
const port: number = 8080;

app.all('*', (request: express.Request, response: express.Response) => {
  response.sendStatus(501);
});

const server: Http2Server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log(`Shutting down...`);
  server.close((error) => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log(`Shutting down...`);
  server.close((error) => {
    process.exit(0);
  });
});
