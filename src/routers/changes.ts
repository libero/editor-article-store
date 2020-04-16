import { default as express } from 'express';
import { logRequest } from '../middlewares/log-request.js';

export const changesRouter: express.Router = express.Router();

// Log all requests on this route.
changesRouter.use(logRequest);

// Get a list of all the changes.
changesRouter.get('/', function(request: express.Request, response: express.Response) {
  response.sendStatus(501);
});

// Creates a new Change
changesRouter.post('/', function(request: express.Request, response: express.Response) {
  response.sendStatus(501);
});

// Get a specific change.
changesRouter.get('/:changeId', function(request: express.Request, response: express.Response) {
  response.sendStatus(501);
});

// Deletes the specified Change
changesRouter.delete('/:changeId', function(request: express.Request, response: express.Response) {
  response.sendStatus(501);
});
