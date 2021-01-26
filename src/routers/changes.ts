import { default as express } from "express";
import { logRequest } from "../middlewares/log-request";
import { http501Response } from "../providers/errors";
import { ArticleService } from "../services/article";
import { ChangeService } from "../services/changes";
import {Change, SerializedChangePayload} from "../types/change";

export default (changesService: ChangeService, articleService: ArticleService): express.Router => {
  const changesRouter: express.Router = express.Router({ mergeParams: true });

  // Log all requests on this route.
  changesRouter.use(logRequest);

  // Get a list of all the changes.
  changesRouter.get(
    "/",
    async (req, res) => {
      const articleId = req.params.articleId;
      const article = await articleService.findByArticleId(articleId);
      if (article === null) {
        return res.sendStatus(404);
      }
      const page = parseInt((req.query.page as string) || '0', 10);
      const changes = await changesService.getChangesforArticle(articleId, page);
      return res.json(changes);
    },
    http501Response
  );

  // Creates a new Change
  changesRouter.post(
    "/",
    async (req, res) => {
      const articleId = req.params.articleId;
      // check article exists
      const article = await articleService.findByArticleId(articleId);
      if (article === null) {
        return res.sendStatus(404);
      }

      if(!req.body?.changes) {
        return res.sendStatus(400);
      }

      for(let change of Object.values(req.body.changes as SerializedChangePayload[])) {
        await changesService.registerChange({
          ...change,
          user: 'static-for-now',
          applied: false,
          articleId
        } as Change);
      }
      return res.sendStatus(200);
    },
    http501Response
  );

  // Get a specific change.
  changesRouter.get("/:changeId", [http501Response]);

  // applies or declines a change. Transform XML and update version number.
  // use prose-mirror transform to apply transcation
  changesRouter.put("/:changeId", [http501Response]);

  // Deletes the specified Change
  changesRouter.delete("/:changeId", [http501Response]);

  return changesRouter;
};
