import { Request, Response } from 'express';
import { uploadToDropbox } from '../utils/dropbox';
import { postToWordpress } from '../utils/wordpress';
import { processFiles } from '../utils/fileHandler';

export const handleListing = async (req: Request, res: Response) => {
  try {
    const {
      category,
      manufacturer,
      model,
      year,
      web_width,
      colors,
      die_stations,
      serial,
      description,
      owner_company,
      owner_name,
      owner_phone,
      owner_email,
      price,
      buy_price
    } = req.body;

    const images = req.files as Express.Multer.File[];
    const listingFolder = `uploads/${model}`;
    processFiles(images, listingFolder);

    const dropboxFolder = `/New Listings/${model}`;
    const dropboxLink = await uploadToDropbox(listingFolder, dropboxFolder);

    const wordpressData = {
      title: `${manufacturer} ${model}`,
      content: `
        Category: ${category}
        Manufacturer: ${manufacturer}
        Model: ${model}
        Year: ${year}
        Web Width: ${web_width}
        Colors: ${colors}
        Die Stations: ${die_stations}
        Serial: ${serial}
        Description: ${description}
        Owner Company: ${owner_company}
        Owner Name: ${owner_name}
        Owner Phone: ${owner_phone}
        Owner Email: ${owner_email}
        Price: ${price}
        Buy Price: ${buy_price}
        Dropbox Link: ${dropboxLink}
      `
    };

    await postToWordpress(wordpressData);

    res.status(201).json({ message: 'Listing created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

