import { Jimp } from "jimp";

export const compressAndResizeImage = async (image) => {
  const jimpImage = await Jimp.read(image);
  const resizedImage = await jimpImage
    .resize(500, 500) // Resize the image to 500x500 pixels
    .quality(80) // Compress the image using JPEG with a quality of 80
    .getBufferAsync(Jimp.MIME_JPEG);
  return resizedImage;
};
