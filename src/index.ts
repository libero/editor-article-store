import { Http2Server } from 'http2';
import { configManager } from './services/config-manager';
import { defaultConfig } from './config/default';
import { createConfigFromArgs, createConfigFromEnv } from './utils/config-utils';
import { articleManager } from './services/article-manager';
import { loadArticlesFromPath } from './utils/article-utils';
import { app } from './server';

import s3SqsListener from './listeners/s3-sqs-listener';

let server: Http2Server;

// Load the configuration for this service with the following precedence...
//   process args > environment vars > config file.
configManager.apply(defaultConfig);
configManager.apply(createConfigFromEnv(process.env));
configManager.apply(createConfigFromArgs(process.argv));

loadArticlesFromPath(configManager.get('articleRoot'), articleManager)
  .then(() => {
    server = app.listen(configManager.get('port'), () => {
      // Make sure the application cleanly shuts down on SIGINT
      process.on('SIGINT', terminate);
      process.on('SIGTERM', terminate);

      s3SqsListener.start();

      console.log(`Server listening at http://localhost:${configManager.get('port')}`);
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
