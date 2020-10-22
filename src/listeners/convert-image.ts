import sharp from "sharp";
import FileType from "file-type";

const supportedMimeTypes = ['image/tiff']; // extend as needed

export default async function convert(buffer: Buffer) {
  const mimeType = await FileType.fromBuffer(buffer);
  if (!supportedMimeTypes.includes(mimeType?.mime as string)) {
      return {
        contentType: null
      }
  }
  console.log('carry on');
  const jpgBuffer = await sharp(buffer)
    .toFormat("jpg")
    .toBuffer();
  const contentType = await FileType.fromBuffer(jpgBuffer);
  return {
    buffer: jpgBuffer,
    contentType,
  };
}
