import { Http2Server } from 'http2';
import { configManager } from './services/config-manager.js';
import { defaultConfig } from './config/default.js';
import { createConfigFromArgs, createConfigFromEnv } from './utils/config-utils.js';
import { articleManager } from './services/article-manager.js';
import { loadArticlesFromPath } from './utils/article-utils.js';
import { app } from './server.js';

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
