"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const processFiles = (files, stockFolder, manufacturer, model, stock_number) => {
    if (!fs_1.default.existsSync(stockFolder)) {
        fs_1.default.mkdirSync(stockFolder, { recursive: true });
    }
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    files.forEach((file, index) => {
        if (!file || !file.originalname)
            return;
        const ext = path_1.default.extname(file.originalname);
        const letter = alphabet[index];
        const newPath = path_1.default.join(stockFolder, `${manufacturer} ${model} ${stock_number}${letter}${ext}`);
        fs_1.default.renameSync(file.path, newPath);
        console.log(`Renamed ${file.originalname} to ${newPath}`);
    });
};
exports.processFiles = processFiles;
