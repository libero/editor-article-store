import { default as express } from "express";
import { logRequest } from "../middlewares/log-request";
import { http501Response } from "../providers/errors";
import { NodeSpec, Schema } from "prosemirror-model";

import { schema as base } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { OrderedMap } from "ordermap";
import { Step } from "prosemirror-transform";

const schema = new Schema({
  nodes: addListNodes(
    (base.spec.nodes as unknown) as OrderedMap<NodeSpec>,
    "paragraph block*",
    "block"
  ),
  marks: base.spec.marks,
});

function nonNegInteger(str: string) {
  const num = Number(str);
  if (!isNaN(num) && Math.floor(num) == num && num >= 0) return num;
  const err = new Error("Not a non-negative integer: " + str);
  throw err;
}

export const changesRouter: express.Router = express.Router();

// Log all requests on this route.
changesRouter.use(logRequest);

// Get a list of all the changes.
changesRouter.get("/", [http501Response]);

// Creates a new Change
changesRouter.post("/", [
  async (request: express.Request, response: express.Response) => {
    const data = request.body;
    let version = nonNegInteger(data.version);
    let steps = data.steps.map((s: any) => Step.fromJSON(schema, s));
    let result = getInstance(request.params.articleId).addEvents(
      version,
      steps,
      data.comment,
      data.clientID
    );
    if (!result) {
      return response.sendStatus(404);
    }
  },
  http501Response,
]);

// Get a specific change.
changesRouter.get("/:changeId", [http501Response]);

// Deletes the specified Change
changesRouter.delete("/:changeId", [http501Response]);
