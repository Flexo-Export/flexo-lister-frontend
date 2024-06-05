import fs from 'fs';
import path from 'path';

export const processFiles = (files: Express.Multer.File[], stockFolder: string, manufacturer: string, model: string, stock_number: string) => {
  if (!fs.existsSync(stockFolder)) {
    fs.mkdirSync(stockFolder, { recursive: true });
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  files.forEach((file, index) => {
    if (!file || !file.originalname) return;
    const ext = path.extname(file.originalname);
    const letter = alphabet[index];
    const newPath = path.join(stockFolder, `${manufacturer} ${model} ${stock_number}${letter}${ext}`);
    fs.renameSync(file.path, newPath);
    console.log(`Renamed ${file.originalname} to ${newPath}`);
  });
};

