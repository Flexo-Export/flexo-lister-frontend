import fs from 'fs';
import path from 'path';

export const processFiles = (files: Express.Multer.File[], destination: string, manufacturer: string, model: string, stock_number: string) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
    console.log(`Created stock folder: ${destination}`);
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  files.forEach((file, index) => {
    const ext = path.extname(file.originalname);
    const letter = alphabet[index];
    const newPath = path.join(destination, `${manufacturer} ${model} ${stock_number}${letter}${ext}`);
    fs.renameSync(file.path, newPath);
    console.log(`Renamed ${file.originalname} to ${newPath}`);
  });
};

