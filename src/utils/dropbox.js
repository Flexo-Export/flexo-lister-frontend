"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.uploadToDropbox = void 0;
const Dropbox = __importStar(require("dropbox"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const readdir = (0, util_1.promisify)(fs_1.default.readdir);
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const dbx = new Dropbox.Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
const uploadToDropbox = (localFolder, dropboxFolder) => __awaiter(void 0, void 0, void 0, function* () {
    yield dbx.filesCreateFolderV2({ path: dropboxFolder });
    const files = yield readdir(localFolder);
    for (const file of files) {
        const filePath = path_1.default.join(localFolder, file);
        const fileContent = yield readFile(filePath);
        const dropboxPath = `${dropboxFolder}/${file}`;
        yield dbx.filesUpload({
            path: dropboxPath,
            contents: fileContent,
        });
    }
    const linkMetadata = yield dbx.sharingCreateSharedLinkWithSettings({ path: dropboxFolder });
    if ('url' in linkMetadata) {
        return linkMetadata.url;
    }
    else if ('result' in linkMetadata && 'url' in linkMetadata.result) {
        return linkMetadata.result.url;
    }
    else {
        throw new Error('Failed to retrieve Dropbox shared link URL');
    }
});
exports.uploadToDropbox = uploadToDropbox;
