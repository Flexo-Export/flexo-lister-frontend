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
exports.handleListing = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const fileHandler_1 = require("../utils/fileHandler");
const dropboxHandler_1 = require("../utils/dropboxHandler");
const tinyUrlHandler_1 = require("../utils/tinyUrlHandler");
const handleListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { manufacturer = '', model = '', owner_company = '', stock_number, order = '', year = '', web_width = '', colors = '', die_stations = '', description = '', 
        //dropbox_url = '',
        owner_name = '', country_code = '', owner_phone = '', owner_email = '', price = '', buy_price = '', notes = '' } = req.body;
        const dropboxAccessToken = process.env.DROPBOX_ACCESS_TOKEN;
        if (!dropboxAccessToken) {
            throw new Error('Dropbox access token not set');
        }
        // Log the order field
        console.log('Order field:', order);
        // Validate email if provided
        if (owner_email && !validateEmail(owner_email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }
        const images = req.files;
        const orderArray = order.split(',').map((filename) => filename.trim());
        const orderedFiles = orderArray.map((filename) => images.find(file => file.originalname === filename));
        // Log the order of files
        console.log('Order Array:', orderArray);
        console.log('Ordered Files:', orderedFiles.map((file) => file === null || file === void 0 ? void 0 : file.originalname));
        const entryPath = process.env.ENTRY_PATH || path_1.default.join(process.cwd(), 'Flexo 2.0');
        const currentYear = new Date().getFullYear().toString();
        const yearFolder = path_1.default.join(entryPath, `${currentYear} Listings`);
        // Ensure the year folder exists
        if (!fs_1.default.existsSync(yearFolder)) {
            fs_1.default.mkdirSync(yearFolder, { recursive: true });
            console.log(`Created year folder: ${yearFolder}`);
        }
        const companyFolder = path_1.default.join(yearFolder, owner_company);
        const stockFolder = path_1.default.join(companyFolder, stock_number);
        console.log('Company folder path:', companyFolder);
        console.log('Stock folder path:', stockFolder);
        // Check for duplicate stock number
        if (fs_1.default.existsSync(stockFolder)) {
            res.status(400).json({ message: 'Duplicate stock number, please try again' });
            return;
        }
        // Create company folder if it doesn't exist
        if (!fs_1.default.existsSync(companyFolder)) {
            fs_1.default.mkdirSync(companyFolder, { recursive: true });
            console.log(`Created company folder: ${companyFolder}`);
        }
        // Process and rename files
        (0, fileHandler_1.processFiles)(orderedFiles, stockFolder, manufacturer, model, stock_number);
        // Upload to Dropbox
        const dropboxStockFolderPath = `/Flexo 2.0/${currentYear} Listings/${owner_company}/${stock_number}`;
        yield (0, dropboxHandler_1.uploadFolderToDropbox)(stockFolder, dropboxStockFolderPath, dropboxAccessToken);
        const dropboxShareLink = yield (0, dropboxHandler_1.getDropboxShareLink)(dropboxStockFolderPath, dropboxAccessToken);
        // Shorten the Dropbox link using TinyURL with custom alias (stock number)
        const shortenedDropboxUrl = yield (0, tinyUrlHandler_1.shortenUrl)(dropboxShareLink, stock_number);
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
        const pythonScriptPath = path_1.default.resolve(__dirname, '../utils/generate_coversheet.py');
        (0, child_process_1.execFile)('python3', [pythonScriptPath, ...coversheetArgs], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generating coversheet: ${error.message}`);
                res.status(500).json({ message: 'An error occurred while generating coversheet', error: error.message });
                return;
            }
            // Move the generated coversheet to the stock folder
            const coversheetPath = path_1.default.join(process.cwd(), `${stock_number} Coversheet.docx`);
            const destinationPath = path_1.default.join(stockFolder, `${stock_number} Coversheet.docx`);
            fs_1.default.renameSync(coversheetPath, destinationPath);
            res.status(201).json({ message: 'Files uploaded, renamed, and coversheet generated successfully' });
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error in handleListing:', error.message);
            res.status(500).json({ message: 'An error occurred', error: error.message });
        }
        else {
            console.error('Unknown error in handleListing:', error);
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.handleListing = handleListing;
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
