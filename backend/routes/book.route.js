import express from 'express';
import { addbook, adjustStock, getBooks, removebook } from '../controllers/book.controller.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/addbook', upload.single('image'), addbook);
router.get('/getbooks', getBooks);
router.delete('/:id', removebook);
router.patch('/stocks/:id',adjustStock);

export default router;