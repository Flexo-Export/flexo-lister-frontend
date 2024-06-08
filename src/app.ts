import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes/index';
import generateDescriptionRouter from './routes/generate-description';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('views', path.join(__dirname, 'views'));  // Set the views directory
app.set('view engine', 'ejs');  // Use EJS as the templating engine

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

