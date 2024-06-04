import fs from 'fs';
import path from 'path';

export const processFiles = (files: Express.Multer.File[], destination: string) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  files.forEach((file, index) => {
    const ext = path.extname(file.originalname);
    const newPath = path.join(destination, `image_${index + 1}${ext}`);
    fs.renameSync(file.path, newPath);
  });
};

