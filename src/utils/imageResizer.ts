import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const MAX_SIZE_MB = 5; // Set max size for jpg/jpeg files (in megabytes)
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MAX_WIDTH = 2000; // Set max width in pixels
const MAX_HEIGHT = 2000; // Set max height in pixels

export const resizeImageIfNeeded = async (filePath: string, ext: string): Promise<void> => {
  console.log(`Checking if resize is needed for ${filePath} with extension ${ext}`);
  
  if (ext === '.jpg' || ext === '.jpeg') {
    const fileSize = fs.statSync(filePath).size;
    console.log(`File size of ${filePath}: ${fileSize} bytes`);
    if (fileSize > MAX_SIZE_BYTES) {
      console.log(`Resizing ${filePath} as it exceeds the max size of ${MAX_SIZE_BYTES} bytes`);
      const buffer = fs.readFileSync(filePath);
      const metadata = await sharp(buffer).metadata();
      console.log(`Metadata for ${filePath}: width=${metadata.width}, height=${metadata.height}`);

      if (metadata.width && metadata.height) {
        const maxSize = Math.sqrt((MAX_SIZE_BYTES / fileSize) * metadata.width * metadata.height);

        // Ensure the new dimensions do not exceed the maximum width and height
        const newWidth = Math.min(Math.round(metadata.width * maxSize / metadata.width), MAX_WIDTH);
        const newHeight = Math.min(Math.round(metadata.height * maxSize / metadata.height), MAX_HEIGHT);

        console.log(`Resizing ${filePath} to dimensions: ${newWidth}x${newHeight}`);

        await sharp(buffer)
          .resize({
            width: newWidth,
            height: newHeight,
            fit: sharp.fit.inside
          })
          .toFile(filePath);

        console.log(`Resized ${filePath} to fit within ${MAX_SIZE_MB} MB, with dimensions ${newWidth}x${newHeight}`);
      } else {
        console.log(`Unable to resize ${filePath}: metadata is missing width or height`);
      }
    } else {
      console.log(`File ${filePath} is within the allowed size limit.`);
    }
  } else {
    console.log(`File ${filePath} with extension ${ext} is not a jpg/jpeg, skipping resize`);
  }
};

