import sharp from "sharp";
import FileType from "file-type";

export default async function convert(buffer: Buffer) {
  const jpgBuffer = await sharp(buffer)
    .toFormat("jpg")
    .toBuffer();
  const contentType = await FileType.fromBuffer(jpgBuffer);
  return {
    buffer: jpgBuffer,
    contentType,
  };
}
