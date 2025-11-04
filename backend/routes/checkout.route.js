import express from 'express';
import { createOrder } from '../controllers/checkout.controller.js';
import upload from '../utils/multer.js';

const router = express.Router();

// POST /api/checkout
router.post('/',upload.single('image'), createOrder);

export default router;