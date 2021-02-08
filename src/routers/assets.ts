import { default as express } from "express";
import path from 'path';
import multer from 'multer';
import { AssetService } from "../services/asset"

const upload = multer();

export default (assetService: AssetService): express.Router => {
  const router = express.Router({mergeParams: true});

  router.post("/", upload.single('file'), async (req, res) => {
    const { articleId } = req.params;
    if (!req.file) {
      console.log('Unable to store asset: No file');
      res.sendStatus(400);
      return;
    }

    const s3Name = await assetService.saveAsset(
      articleId,
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    res.json({assetName: s3Name});
  });

  router.get("/:fileKey", async (req, res) => {
    const { articleId, fileKey } = req.params;
    const assetKey = `${articleId}/${fileKey}`;
    const assetUrl = await assetService.getAssetUrl(assetKey);
    if (assetUrl === null) {
      res.sendStatus(404);
    } else {
      res.redirect(302, assetUrl);
    }
  });

  return router;
};
