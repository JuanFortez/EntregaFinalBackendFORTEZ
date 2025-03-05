// productRouter.js
import express from "express";
import productController from "../public/js/productController.js";
const router = express.Router();

// Obtener todos los productos con filtros, paginación y ordenamiento
router.get("/:products", productController.getProducts);

// Obtener un producto por ID
router.get("/:pid", productController.getProductById);

// Crear un nuevo producto
router.post("/", productController.createProduct);

// Actualizar un producto por ID
router.put("/:pid", productController.updateProduct);

// Eliminar un producto por ID
router.delete("/:pid", productController.deleteProduct);

export default router;