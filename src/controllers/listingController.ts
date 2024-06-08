import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { Request, Response } from 'express';
import { processFiles } from '../utils/fileHandler';
import { uploadFolderToDropbox, getDropboxShareLink } from '../utils/dropboxHandler';
import { shortenUrl } from '../utils/tinyUrlHandler';
import dotenv from 'dotenv';

export const handleListing = async (req: Request, res: Response) => {
  try {
    const {
      manufacturer = '',
      model = '',
      owner_company = '',
      stock_number,
      order = '',
      year = '',
      web_width = '',
      colors = '',
      die_stations = '',
      description = '',
      //dropbox_url = '',
      owner_name = '',
      country_code = '',
      owner_phone = '',
      owner_email = '',
      price = '',
      buy_price = '',
      notes = ''
    } = req.body;



    const dropboxAccessToken = process.env.DROPBOX_ACCESS_TOKEN;
    if (!dropboxAccessToken) {
      throw new Error('Dropbox access token not set');
    }

    // Log Dropbox access token (remove this in production)
    console.log('Dropbox access token:', dropboxAccessToken);

    // Log the order field
    console.log('Order field:', order);



    // Log the order field
    console.log('Order field:', order);

    // Validate email if provided
    if (owner_email && !validateEmail(owner_email)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    const images = req.files as Express.Multer.File[];
    const orderArray = order.split(',').map((filename: string) => filename.trim());
    const orderedFiles = orderArray.map((filename: string) => images.find(file => file.originalname === filename));

    // Log the order of files
    console.log('Order Array:', orderArray);
    console.log('Ordered Files:', orderedFiles.map((file: Express.Multer.File | undefined) => file?.originalname));

    const entryPath = process.env.ENTRY_PATH || path.join(process.cwd(), 'Flexo 2.0');
    const currentYear = new Date().getFullYear().toString();
    const yearFolder = path.join(entryPath, `${currentYear} Listings`);

    // Ensure the year folder exists
    if (!fs.existsSync(yearFolder)) {
      fs.mkdirSync(yearFolder, { recursive: true });
      console.log(`Created year folder: ${yearFolder}`);
    }

    const companyFolder = path.join(yearFolder, owner_company);
    const stockFolder = path.join(companyFolder, stock_number);

    console.log('Company folder path:', companyFolder);
    console.log('Stock folder path:', stockFolder);

    // Check for duplicate stock number
    if (fs.existsSync(stockFolder)) {
      res.status(400).json({ message: 'Duplicate stock number, please try again' });
      return;
    }

    // Create company folder if it doesn't exist
    if (!fs.existsSync(companyFolder)) {
      fs.mkdirSync(companyFolder, { recursive: true });
      console.log(`Created company folder: ${companyFolder}`);
    }

    // Process and rename files
    processFiles(orderedFiles as Express.Multer.File[], stockFolder, manufacturer, model, stock_number);


    // Upload to Dropbox
    const dropboxStockFolderPath = `/Flexo 2.0/${currentYear} Listings/${owner_company}/${stock_number}`;
    await uploadFolderToDropbox(stockFolder, dropboxStockFolderPath, dropboxAccessToken);
    const dropboxShareLink = await getDropboxShareLink(dropboxStockFolderPath, dropboxAccessToken);

    // Shorten the Dropbox link using TinyURL with custom alias (stock number)
    const shortenedDropboxUrl = await shortenUrl(dropboxShareLink, stock_number);


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
      shortenedDropboxUrl,
      owner_company,
      owner_name,
      `${country_code} ${owner_phone}`,
      owner_email,
      price,
      buy_price,
      notes
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

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

