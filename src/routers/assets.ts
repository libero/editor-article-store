import { default as express } from "express";
import { logRequest } from "../middlewares/log-request";

export default (assetService: any): express.Router => {
  const router = express.Router({mergeParams: true});

  // Log all requests on this route.
  router.use(logRequest);

  router.get("/:fileKey", async (req, res) => {
    const { articleId, fileKey } = req.params;
    const assetUrl = await assetService.getAssetUrl(articleId, fileKey);
    if (assetUrl === null) {
      res.sendStatus(404);
    } else {
      res.redirect(301, assetUrl);
    }
  });

  return router;
};