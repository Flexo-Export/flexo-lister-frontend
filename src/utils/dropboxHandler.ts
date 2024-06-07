import { Dropbox } from 'dropbox';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';

export const uploadFolderToDropbox = async (localFolderPath: string, dropboxFolderPath: string, accessToken: string) => {
    const dbx = new Dropbox({ accessToken, fetch });

    const files = fs.readdirSync(localFolderPath);
    for (const file of files) {
        const filePath = path.join(localFolderPath, file);
        const fileContents = fs.readFileSync(filePath);
        const dropboxFilePath = path.join(dropboxFolderPath, file).replace(/\\/g, '/');

        try {
            const response = await dbx.filesUpload({ path: dropboxFilePath, contents: fileContents });
            console.log(`Uploaded ${filePath} to Dropbox at ${dropboxFilePath}`, response);
        } catch (error) {
            console.error(`Failed to upload ${filePath} to Dropbox at ${dropboxFilePath}`, error);
            throw error;
        }
    }
};

export const getDropboxShareLink = async (dropboxFolderPath: string, accessToken: string) => {
    const dbx = new Dropbox({ accessToken, fetch });
    try {
        const shareLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({ path: dropboxFolderPath });
        console.log(`Created Dropbox share link for ${dropboxFolderPath}`, shareLinkResponse);
        return shareLinkResponse.result.url.replace('?dl=0', '?dl=1'); // Make direct download link
    } catch (error) {
        console.error(`Failed to create Dropbox share link for ${dropboxFolderPath}`, error);
        throw error;
    }
};
