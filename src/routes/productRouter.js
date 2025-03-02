// productRouter.js
import express from 'express';
import productController from '../public/js/productController.js';
const router = express.Router();

// Obtener todos los productos con filtros, paginación y ordenamiento
router.get('/', productController.getProducts);

// Obtener un producto por ID
router.get('/:pid', productController.getProductById);


// Crear un nuevo producto
router.post('/', productController.createProduct);

// Actualizar un producto por ID
router.put('/:pid', productController.updateProductById);

// Eliminar un producto por ID
router.delete('/:pid', productController.deleteProductById);

export default router;