import { default as express } from "express";
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

    const s3Key = await assetService.saveAsset(
      articleId,
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    res.json({assetKey: s3Key});
  });

  router.get("/:fileUuid/:fileName?", async (req, res) => {
    const { articleId, fileUuid, fileName} = req.params;
    const fileKey = typeof fileName === 'undefined' ? fileUuid : `${fileUuid}/${fileName}`;
    let assetKey = `${articleId}/${fileKey}`;
    
    if (typeof fileName === 'undefined') {
      const [ key ] = await assetService.getArticleAssetKeysByFilename(articleId, fileKey);
      assetKey = key;
    }

    if (!assetKey) {
      console.log(`Asset Key not found for { articleId: ${articleId}, fileKey: ${fileKey} }`);
      res.sendStatus(404);
      return;
    }
    const assetUrl = await assetService.getAssetUrl(assetKey);
    if (assetUrl === null) {
      console.log('Asset URL not found for ' + assetKey);
      res.sendStatus(404);
    } else {
      res.redirect(302, assetUrl);
    }
  });

  return router;
};
