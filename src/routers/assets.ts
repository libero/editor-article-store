import { default as express } from "express";
import multer from 'multer';

import { logRequest } from "../middlewares/log-request";
import { AssetService } from "../services/asset"

const upload = multer();

export default (assetService: AssetService): express.Router => {
  const router = express.Router({mergeParams: true});

  // Log all requests on this route.
  router.use(logRequest);

  router.post("/", upload.single('file'), async (req, res) => {
    const { articleId } = req.params;
    const s3Name = await assetService.saveFileToS3(
      articleId,
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    res.json({assetName: s3Name});
  });

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
