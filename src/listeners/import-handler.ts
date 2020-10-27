import { Article } from "../types/article";
import { Db } from "mongodb";
import { S3 } from "aws-sdk";
import decompress from "decompress";
import { stringType } from "aws-sdk/clients/iam";
import convert from "./convert-image";
import FileType from "file-type";

export default (s3:S3, db: Db, targetBucket:stringType) => {
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

const directoryHasXmlArticle = (directory: decompress.File[]) => {
  for (const file of directory) {
    if (file.path.includes(".xml")) {
      return true;
    }
  }
  return false;
}

  return {
    import: async (key:string, srcBucket:string) => {
      let zipContentsDirectory;
      const { articleId, version } = extractS3Path(key);
      try {
        const { Body } = await s3
          .getObject({
            Key: key,
            Bucket: srcBucket,
          })
          .promise();
        zipContentsDirectory = await decompress(Body as Buffer);
      } catch (error) {
        throw new Error(
          `Error when fetching and unzipping object: { Key: ${key}, Bucket: ${srcBucket} } - ${error}`
        );
      }
      
      if(!directoryHasXmlArticle(zipContentsDirectory)) {
        throw new Error(
          `Error finding article XML file in object: { Key: ${key}, Bucket: ${srcBucket} }`
        );
      }

      for (const file of zipContentsDirectory) {
        if (file) {
          const fileName = getFilenameFromPath(file.path);
          const content = await file.data;
          const contentType = await FileType.fromBuffer(content);
          const params = {
            Body: content,
            Bucket: targetBucket,
            Key: `${articleId}/${fileName}`,
            ACL: "private",
            ContentType: contentType?.mime,
          };
          try {
            await s3.putObject(params).promise();
            console.log(
              `Object stored: { Key: ${articleId}/${fileName}, Bucket: ${targetBucket} }`
            );
          } catch (error) {
            throw new Error(
              `Error when storing object: { Key: ${articleId}/${fileName}, Bucket: ${targetBucket} } - ${error}`
            );
          }

          if (file.path.includes(".tif")) {
            let convertedTif;
            try {
              convertedTif = await convert(
                content
              );
            } catch(error) {
              throw new Error(`Error when converting .tif file: { Key: ${articleId}/${fileName}, Bucket: ${targetBucket} } - ${error}`)
            }

            const jpgKey = `${articleId}/${fileName.replace(
              ".tif",
              ".jpg"
            )}`;

            try {
              const { buffer: jpgBuffer, contentType: jpgCcontentType } = convertedTif;
              const jpgParams = {
                Body: jpgBuffer || '', // todo: check if buffer is null
                Bucket: targetBucket,
                Key: jpgKey,
                ACL: "private",
                ContentType: jpgCcontentType?.mime,
              };
              await s3.putObject(jpgParams).promise();
              console.log(
                `Object stored: { Key: ${jpgKey}, Bucket: ${targetBucket} }`
              );
            } catch(error) {
              throw new Error(
                `Error when storing object: { Key: ${jpgKey}, Bucket: ${targetBucket} } converted from .tif file: { Key: ${articleId}/${fileName}, Bucket: ${targetBucket} } - ${error}`
              );
            }
          }
  
          if (file.path.includes(".xml")) {
            try {
              const articleToStore = {
                xml: content.toString(),
                articleId,
                version,
                datatype: "xml",
                fileName,
              };
              await writeArticleToDb(articleToStore as Article);
              console.log(
                `Article XML stored: { ArticleID: ${articleId}, Version: ${version} }`
              );
            } catch (error) {
              throw new Error(
                `Error storing article XML: { ArticleID: ${articleId}, Version: ${version} } - ${error}`);
            }
          }
        }
      }
    }
  }
}
       