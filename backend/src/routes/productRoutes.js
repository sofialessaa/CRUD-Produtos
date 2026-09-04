import express from 'express';
import { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById } from '../controllers/productController.js';
import { checkProductExists } from '../middleware/checkProductExists.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.put('/:id', checkProductExists, updateProduct);
router.delete('/:id', checkProductExists, deleteProduct);
router.get('/:id', checkProductExists, getProductById);

export default router;