import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { processFiles } from '../utils/fileHandler';

export const handleListing = async (req: Request, res: Response) => {
  try {
    const {
      manufacturer,
      model,
      owner_company,
      stock_number,
      order
    } = req.body;

    const images = req.files as Express.Multer.File[];
    const orderArray = order.split(',').map((index: string) => parseInt(index, 10));
    const orderedFiles = orderArray.map((index: number) => images[index]);

    const listingsFolder = 'listings';
    const companyFolder = `${listingsFolder}/${owner_company}`;
    const stockFolder = `${companyFolder}/${stock_number}`;

    console.log('Company folder path:', companyFolder);
    console.log('Stock folder path:', stockFolder);

    // Create company folder if it doesn't exist
    if (!fs.existsSync(companyFolder)) {
      fs.mkdirSync(companyFolder, { recursive: true });
      console.log(`Created company folder: ${companyFolder}`);
    }

    // Process and rename files
    processFiles(orderedFiles, stockFolder, manufacturer, model, stock_number);

    res.status(201).json({ message: 'Files uploaded and renamed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in handleListing:', error.message);
      res.status(500).json({ message: 'An error occurred', error: error.message });
    } else {
      console.error('Unknown error in handleListing:', error);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

