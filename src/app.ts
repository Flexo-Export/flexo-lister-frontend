import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes/index';
import multer from 'multer';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', indexRouter);

app.post('/upload', upload.array('images'), (req, res) => {
  res.send('Files uploaded successfully');
});

export default app;

