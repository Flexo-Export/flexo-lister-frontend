import * as Dropbox from 'dropbox';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const dbx = new Dropbox.Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

export const uploadToDropbox = async (localFolder: string, dropboxFolder: string): Promise<string> => {
  await dbx.filesCreateFolderV2({ path: dropboxFolder });

  const files = await readdir(localFolder);

  for (const file of files) {
    const filePath = path.join(localFolder, file);
    const fileContent = await readFile(filePath);
    const dropboxPath = `${dropboxFolder}/${file}`;

    await dbx.filesUpload({
      path: dropboxPath,
      contents: fileContent,
    });
  }

  const linkMetadata = await dbx.sharingCreateSharedLinkWithSettings({ path: dropboxFolder });
  return linkMetadata.url;
};

