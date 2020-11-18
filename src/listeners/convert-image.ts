import sharp from "sharp";
import FileType from "file-type";
import core from "file-type/core";

const supportedMimeTypes = ['image/tiff']; // extend as needed

type ConvertedImage = {
  buffer: Buffer | undefined;
  contentType: core.FileTypeResult | null | undefined;
}

export default async function convert(buffer: Buffer): Promise<ConvertedImage> {
  const mimeType = await FileType.fromBuffer(buffer);
  if (!supportedMimeTypes.includes(mimeType?.mime as string)) {
      return {
        buffer: undefined,
        contentType: null
      }
  }
  const jpgBuffer = await sharp(buffer)
    .toFormat("jpg")
    .toBuffer();
  const contentType = await FileType.fromBuffer(jpgBuffer);
  return {
    buffer: jpgBuffer,
    contentType,
  };
}
