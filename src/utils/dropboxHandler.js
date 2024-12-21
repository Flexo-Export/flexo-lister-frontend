"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDropboxShareLink = exports.uploadFolderToDropbox = void 0;
const dropbox_1 = require("dropbox");
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadFolderToDropbox = (localFolderPath, dropboxFolderPath, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const dbx = new dropbox_1.Dropbox({ accessToken, fetch: node_fetch_1.default });
    const files = fs_1.default.readdirSync(localFolderPath);
    for (const file of files) {
        const filePath = path_1.default.join(localFolderPath, file);
        const fileContents = fs_1.default.readFileSync(filePath);
        const dropboxFilePath = path_1.default.join(dropboxFolderPath, file).replace(/\\/g, '/');
        try {
            const response = yield dbx.filesUpload({ path: dropboxFilePath, contents: fileContents });
            console.log(`Uploaded ${filePath} to Dropbox at ${dropboxFilePath}`, response);
        }
        catch (error) {
            console.error(`Failed to upload ${filePath} to Dropbox at ${dropboxFilePath}`, error);
            if (error instanceof Error && 'status' in error && error.status === 401) {
                console.error('Invalid Dropbox access token or insufficient permissions');
            }
            throw error;
        }
    }
});
exports.uploadFolderToDropbox = uploadFolderToDropbox;
const getDropboxShareLink = (dropboxFolderPath, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const dbx = new dropbox_1.Dropbox({ accessToken, fetch: node_fetch_1.default });
    try {
        const shareLinkResponse = yield dbx.sharingCreateSharedLinkWithSettings({ path: dropboxFolderPath });
        console.log(`Created Dropbox share link for ${dropboxFolderPath}`, shareLinkResponse);
        return shareLinkResponse.result.url.replace('?dl=0', '?dl=1'); // Make direct download link
    }
    catch (error) {
        console.error(`Failed to create Dropbox share link for ${dropboxFolderPath}`, error);
        if (error instanceof Error && 'status' in error && error.status === 401) {
            console.error('Invalid Dropbox access token or insufficient permissions');
        }
        throw error;
    }
});
exports.getDropboxShareLink = getDropboxShareLink;
