import express from 'express';
import { createOrder, getOrders } from '../controllers/checkout.controller.js';
import upload from '../utils/multer.js';

const router = express.Router();

// POST /api/checkout
router.post('/',upload.single('image'), createOrder);
router.get('/getorders', getOrders);

export default router;