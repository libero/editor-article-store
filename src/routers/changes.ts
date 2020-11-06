import { default as express } from "express";
import { logRequest } from "../middlewares/log-request";
import { http501Response } from "../providers/errors";

export default (changesService: any): express.Router => {
  const changesRouter: express.Router = express.Router();

  // Log all requests on this route.
  changesRouter.use(logRequest);

  // Get a list of all the changes.
  changesRouter.get(
    "/",
    async (req, res) => {
      const articleId = req.params.articleId;
      const changes = await changesService.getChangesforArticle(articleId);
      return res.json({ changes });
    },
    http501Response
  );

  // Creates a new Change
  changesRouter.post(
    "/",
    async (req, res) => {
      const articleId = req.params.articleId;
      // TODO: add validation;
      const change = req.body;
      await changesService.registerChange({
        ...change,
        articleId,
      });
      return res.sendStatus(200);
    },
    http501Response
  );

  // Get a specific change.
  changesRouter.get("/:changeId", [http501Response]);

  // Deletes the specified Change
  changesRouter.delete("/:changeId", [http501Response]);

  return changesRouter;
};
