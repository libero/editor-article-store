import { default as cors } from "cors";
import { default as express } from "express";
import { Http2Server } from "http2";

import articlesRouter from "./routers/articles";
import { changesRouter } from "./routers/changes";
import { http404Response } from "./providers/errors";
import { configManager } from "./services/config-manager";
import ArticleService from './services/article';
import { defaultConfig } from "./config/default";
import {
  createConfigFromArgs,
  createConfigFromEnv,
} from "./utils/config-utils";

import initialiseDb from './db';

// Load the configuration for this service with the following precedence...
//   process args > environment vars > config file.
configManager.apply(defaultConfig);
configManager.apply(createConfigFromEnv(process.env));
configManager.apply(createConfigFromArgs(process.argv));

// Connection URL
const mongoUrl = configManager.get("mongoUrl");

// Database Name
const dbName = configManager.get("mongoDbName");

export default async function start() {
  let server: Http2Server;
  const app: express.Application = express();

  const db = await initialiseDb(mongoUrl, dbName);

  // Initialize services
  const articleService = ArticleService(db);

  // Register middlewares
  app.use(cors());

  // Register routers
  app.use("/articles", articlesRouter(articleService));
  app.use("/articles/:articleId/changes", changesRouter);

  // Register 'catch all' handler
  app.all("*", http404Response);

  // Starts server
  server = app.listen(configManager.get("port"), () => {
    // Make sure the application cleanly shuts down on SIGINT
    process.on("SIGINT", terminate);
    process.on("SIGTERM", terminate);
    console.log(
      `Server listening at http://localhost:${configManager.get("port")}`
    );
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
}
