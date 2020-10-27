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

  const fetchAndUnzip = async (Key: string, Bucket: string) => {
    const { Body } = await s3
    .getObject({
      Key,
      Bucket,
    })
    .promise();
    return decompress(Body as Buffer);
  }

  const getFileDetails = async (file: decompress.File) => {
    const fileName = getFilenameFromPath(file.path);
    const content = await file.data;
    const contentType = await FileType.fromBuffer(content);
    return { fileName, content, contentType}
  }
  const storeFileToTargetS3 = async (Body: Buffer | string = '', Key: string, ContentType: string|undefined) => {
    const params = {
      Body,
      Bucket: targetBucket,
      Key,
      ACL: "private",
      ContentType,
    };
    await s3.putObject(params).promise();
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
      
      if(!directoryHasXmlArticle(zipContentsDirectory)) {
        throw new Error(
          `Error finding article XML file in object: { Key: ${key}, Bucket: ${srcBucket} }`
        );
      }

      for (const file of zipContentsDirectory) {
        if (file) {
          const { fileName, content, contentType } = await getFileDetails(file);
          try {
            await storeFileToTargetS3(content, `${articleId}/${fileName}`, contentType?.mime);
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
              await storeFileToTargetS3(jpgBuffer, jpgKey, jpgCcontentType?.mime as unknown as string);
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
       