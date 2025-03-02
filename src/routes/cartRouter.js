// cartRouter.js
import express from "express";
const router = express.Router();
import cartController from '../public/js/cartController.js';

// Obtener un carrito por ID
router.get('/:cid', cartController.getCartById);

// Crear un nuevo carrito
router.post('/', cartController.createCart);

// Agregar un producto a un carrito
router.post('/:cid/products/:pid', cartController.addProductToCart);

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', cartController.removeProductFromCart);

// Actualizar el carrito con un array de productos
router.put('/:cid', cartController.updateCart);

// Actualizar solo la cantidad de un producto
router.put('/:cid/products/:pid', cartController.updateProductQuantity);

// Eliminar todos los productos del carrito
router.delete('/:cid', cartController.clearCart);

export default router;