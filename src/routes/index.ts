import express from 'express';
import { handleListing } from '../controllers/listingController';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/listing', upload.array('images'), handleListing);

export default router;

