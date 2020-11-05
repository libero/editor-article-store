import { default as express } from 'express';
import { logRequest } from '../middlewares/log-request';
import { http501Response } from '../providers/errors';
import {Schema} from "prosemirror-model";

import {schema as base} from "prosemirror-schema-basic";
import {addListNodes} from "prosemirror-schema-list";

export const changesRouter: express.Router = express.Router();

// Log all requests on this route.
changesRouter.use(logRequest);

// Get a list of all the changes.
changesRouter.get('/', [http501Response]);

// Creates a new Change
changesRouter.post('/', [http501Response]);

// Get a specific change.
changesRouter.get('/:changeId', [http501Response]);

// Deletes the specified Change
changesRouter.delete('/:changeId', [http501Response]);
