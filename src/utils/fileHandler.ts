import fs from 'fs';
import path from 'path';
import { resizeImageIfNeeded } from './imageResizer';

export const processFiles = (files: Express.Multer.File[], stockFolder: string, manufacturer: string, model: string, stock_number: string) => {
  if (!fs.existsSync(stockFolder)) {
    fs.mkdirSync(stockFolder, { recursive: true });
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  files.forEach(async (file, index) => {
    if (!file || !file.originalname) return;
    const ext = path.extname(file.originalname).toLowerCase();
    const letter = alphabet[index];
    const newPath = path.join(stockFolder, `${manufacturer} ${model} ${stock_number}${letter}${ext}`);

    console.log(`Processing file: ${file.originalname} with path: ${file.path}`);
    console.log(`File extension detected: ${ext}`);

    // Resize the image if needed
    await resizeImageIfNeeded(file.path, ext);

    fs.renameSync(file.path, newPath);
    console.log(`Renamed ${file.originalname} to ${newPath}`);
  });
};

