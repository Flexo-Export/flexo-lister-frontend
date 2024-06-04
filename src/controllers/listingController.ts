import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { Request, Response } from 'express';
import { processFiles } from '../utils/fileHandler';

export const handleListing = async (req: Request, res: Response) => {
  try {
    const {
      manufacturer,
      model,
      owner_company,
      stock_number,
      order,
      year,
      web_width,
      colors,
      die_stations,
      description,
      dropbox_url,
      owner_name,
      owner_phone,
      price,
      buy_price
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

    // Generate coversheet document
    const coversheetArgs = [
      stock_number,
      manufacturer,
      model,
      year,
      web_width,
      colors,
      die_stations,
      description,
      dropbox_url,
      owner_company,
      owner_name,
      owner_phone,
      price,
      buy_price
    ];

    const pythonScriptPath = path.resolve(__dirname, '../utils/generate_coversheet.py');

    execFile('python3', [pythonScriptPath, ...coversheetArgs], (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error generating coversheet: ${error.message}`);
        res.status(500).json({ message: 'An error occurred while generating coversheet', error: error.message });
        return;
      }

      // Move the generated coversheet to the stock folder
      const coversheetPath = path.join(process.cwd(), `${stock_number} Coversheet.docx`);
      const destinationPath = path.join(stockFolder, `${stock_number} Coversheet.docx`);
      fs.renameSync(coversheetPath, destinationPath);

      res.status(201).json({ message: 'Files uploaded, renamed, and coversheet generated successfully' });
    });
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

