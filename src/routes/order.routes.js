import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/order.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router()

router.post("/", verifyToken, createOrder)
router.get("/", verifyToken, getUserOrders)

export default router