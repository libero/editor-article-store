import startServer from "./server";
import startSqsListener from "./listeners/s3-sqs-listener";

// Starts SQS and server, this should manage it's own depedencies
startSqsListener();
startServer();