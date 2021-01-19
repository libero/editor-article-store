import { default as cors } from "cors";
import { default as fs } from 'fs';
import { default as express } from "express";
import { default as path } from "path";
import { Http2Server } from "http2";
import AWS from "aws-sdk";
import bodyParser from "body-parser";

import articlesRouter from "./routers/articles";
import assetRouter from "./routers/assets";
import changesRouter from "./routers/changes";
import { http404Response } from "./providers/errors";
import { configManager } from "./services/config-manager";
import ArticleService from "./services/article";
import ChangesService from "./services/changes";
import AssetService from "./services/asset";
import { defaultConfig } from "./config/default";
import {
  createConfigFromArgs,
  createConfigFromEnv,
} from "./utils/config-utils";

import initialiseDb from "./db";

// Load the configuration for this service with the following precedence...
//   process args > environment vars > config file.
configManager.apply(defaultConfig);
configManager.apply(createConfigFromEnv(process.env));
configManager.apply(createConfigFromArgs(process.argv));

// Connection URL
const dbUrl = configManager.get("dbUrl");

// Database Name
const dbName = configManager.get("dbName");

// connect to cluster with TSL enabled 
const dbSSLValidate = configManager.get("dbSSLValidate");

//TODO: make cert file name configurable
const dbCertLocation = "/rds-combined-ca-bundle.pem";

export default async function start() {
  console.log('Starting server...');
  let server: Http2Server;
  let dbSSLCert: (string | Buffer)[] | undefined;
  const app: express.Application = express();

  if(dbSSLValidate) {
    dbSSLCert = [fs.readFileSync(dbCertLocation)]
  }

  const db = await initialiseDb(dbUrl, dbName, dbSSLCert);

  AWS.config.update({
    region: configManager.get("awsRegion"),
    accessKeyId: configManager.get("awsAccessKey"),
    secretAccessKey: configManager.get("awsSecretAccessKey"),
  });
  const s3 = new AWS.S3({
    endpoint: configManager.get("awsEndPoint"),
    apiVersion: "2006-03-01",
    signatureVersion: "v4",
    s3ForcePathStyle: true,
  });

  // Initialize services
  const articleService = ArticleService(db);
  const changesService = ChangesService(db);
  const assetService = AssetService(s3, configManager);

  // Register middlewares
  app.use(cors());
  app.use(bodyParser.json());

  // Register routers
  app.use("/articles", articlesRouter(articleService));
  app.use("/articles/:articleId/assets", assetRouter(assetService));
  app.use(
    "/articles/:articleId/changes",
    changesRouter(changesService, articleService)
  );
  app.get("/health", (req, res, next) => res.sendStatus(200));

  // Register 'catch all' handler
  app.all("*", http404Response);

  // Starts server
  server = app.listen(configManager.get("port"), () => {
    // Make sure the application cleanly shuts down on SIGINT
    process.on("SIGINT", terminate);
    process.on("SIGTERM", terminate);
    console.log(
      `Server listening on port ${configManager.get("port")}`
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

  return app;
}
