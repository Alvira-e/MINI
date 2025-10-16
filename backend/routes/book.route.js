import express from 'express';
import { addbook, getBooks, removebook } from '../controllers/book.controller.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/addbook', upload.single('image'), addbook);
router.get('/getbooks', getBooks);
router.delete('/:id', removebook);

export default router;