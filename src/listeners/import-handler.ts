import { Article } from "../types/article";
import { Db } from "mongodb";
import decompress from "decompress";
import FileType from "file-type";
import { AssetService } from '../services/asset';
import { TransformService } from '../services/transform';

export default function importHandler(assetService: AssetService, transformService: TransformService, db: Db, transformEnabled: boolean = false) {
  // S3 has the following format /folder/zip-id-version.zip
  const extractS3Path = (s3Key: string): {
    version: string;
    articleId: string;
  } => {
    const s3Paths = s3Key.split("/");
    const fileNameParts = s3Paths[s3Paths.length - 1].split("-");
    const articleId = fileNameParts[1];
    const version = fileNameParts[fileNameParts.length - 1].replace(".zip", "");
    return {
      articleId,
      version,
    };
  };

  const getFilenameFromPath = (filePath: string) => {
    const filePaths = filePath.split("/");
    return filePaths[filePaths.length - 1];
  };

  const writeArticleToDb = async (article: Article) => {
    await db.collection("articles").insertOne({
      ...article,
    });
  };

  const fetchAndUnzip = async (key: string, bucket: string) => {
    const Body = await assetService.getAsset(key, bucket);
    return decompress(Body as Buffer);
  }

  const getFileDetails = async (file: decompress.File) => {
    const fileName = getFilenameFromPath(file.path);
    const content = await file.data;
    const contentType = await FileType.fromBuffer(content);
    return { fileName, content, contentType}
  }

  const processAssetLocations = (xml: string, assets: Array<{fileName: string; assetKey:string}>): string => {  
    let returnXml = xml;
    for(const asset of assets) {
      returnXml = returnXml.replace(asset.fileName, '/assets/' + asset.assetKey);
    }
    return returnXml;
  }

  return {
    import: async (key:string, srcBucket:string) => {
      let zipContentsDirectory;
      const { articleId, version } = extractS3Path(key);
      try {
        zipContentsDirectory = await fetchAndUnzip(key, srcBucket);
      } catch (error) {
        throw new Error(
          `Error when fetching and unzipping object: { Key: ${key}, Bucket: ${srcBucket} } - ${error}`
        );
      }
      
      if(!zipContentsDirectory.find(file => file.path.includes(".xml"))) {
        throw new Error(
          `Error finding article XML file in object: { Key: ${key}, Bucket: ${srcBucket} }`
        );
      }

      const assetList = [];
      let xmlAsset;
      for (const file of zipContentsDirectory) {
        if (file) {
          const { fileName, content, contentType } = await getFileDetails(file);
          const assetKey = await assetService.saveAsset(articleId, content, contentType?.mime as string, fileName);
          assetList.push({ assetKey, fileName });
          if (file.path.includes(".xml")) {
            xmlAsset = { fileName, content };
          }
        }
      }


      if (xmlAsset) {
        let xml = processAssetLocations(xmlAsset.content.toString(), assetList);
        if (transformEnabled) {
          xml = await transformService.importTransform(xml)
        }

        try {
          const articleToStore = {
            xml,
            articleId,
            version,
            datatype: "xml",
            fileName: xmlAsset.fileName,
          };
          await writeArticleToDb(articleToStore as Article);
          console.log(
            `Article XML stored: { ArticleID: ${articleId}, Version: ${version} }`
          );
        } catch (error) {
          throw new Error(
            `Error storing article XML: { ArticleID: ${articleId}, Version: ${version} } - ${error.message}`);
        }
      }
    }
  }
}