"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const generate_description_1 = __importDefault(require("./routes/generate-description"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.set('views', path_1.default.join(__dirname, 'views')); // Set the views directory
app.set('view engine', 'ejs'); // Use EJS as the templating engine
// Load configuration from config.json
const configPath = path_1.default.resolve(__dirname, '..', 'config.json');
let config = {};
if (fs_1.default.existsSync(configPath)) {
    config = JSON.parse(fs_1.default.readFileSync(configPath, 'utf8'));
}
const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN || config.DROPBOX_ACCESS_TOKEN;
const ENTRY_PATH = process.env.ENTRY_PATH || config.ENTRY_PATH;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || config.OPENAI_API_KEY;
if (!DROPBOX_ACCESS_TOKEN || !ENTRY_PATH || !OPENAI_API_KEY) {
    throw new Error('Missing required configuration. Please set environment variables or provide a valid config.json file.');
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', index_1.default);
app.use('/api', generate_description_1.default); // Add this line
// Route to serve the form
app.get('/', (req, res) => {
    res.render('form');
});
app.post('/upload', upload.array('images'), (req, res) => {
    res.send('Files uploaded successfully');
});
exports.default = app;
