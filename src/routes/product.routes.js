import { Router } from 'express';
import { getCategories, createCategory, getProducts, getProductById, createProduct, updateProduct, deleteProduct, } from '../controllers/product.controller.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router()

// Rutas Públicas
router.get("/", getProducts)
router.get("/categories", getCategories)
router.get("/:id", getProductById)

// Rutas Protegidas (Solo Admin)
router.post("/categories", verifyToken, isAdmin, createCategory)
router.post("/", verifyToken, isAdmin, createProduct)
router.put("/:id", verifyToken, isAdmin, updateProduct)
router.delete("/:id", verifyToken, isAdmin, deleteProduct)

export default router