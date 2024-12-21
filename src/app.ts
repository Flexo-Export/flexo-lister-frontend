import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes/index';
import generateDescriptionRouter from './routes/generate-description';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('views', path.join(__dirname, 'views'));  // Set the views directory
app.set('view engine', 'ejs');  // Use EJS as the templating engine

// Define the type for the config object
interface Config {
  DROPBOX_ACCESS_TOKEN?: string;
  ENTRY_PATH?: string;
  OPENAI_API_KEY?: string;
}

// Load configuration from config.json
const configPath = path.resolve(__dirname, '..', 'config.json');
let config: Config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN || config.DROPBOX_ACCESS_TOKEN;
const ENTRY_PATH = process.env.ENTRY_PATH || config.ENTRY_PATH;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || config.OPENAI_API_KEY;

if (!DROPBOX_ACCESS_TOKEN || !ENTRY_PATH || !OPENAI_API_KEY) {
  throw new Error('Missing required configuration. Please set environment variables or provide a valid config.json file.');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', indexRouter);
app.use('/api', generateDescriptionRouter); // Add this line

// Route to serve the form
app.get('/', (req, res) => {
  res.render('form');
});

app.post('/upload', upload.array('images'), (req, res) => {
  res.send('Files uploaded successfully');
});

export default app;

