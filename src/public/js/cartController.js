// cartController.js
import CartModel from '../../models/cart.model.js';

class CartController {
    async getCartById(req, res) {
        try {
            const cartId = req.params.cid;
            
            // Obtener el carrito y populator los productos
            const cart = await CartModel.findById(cartId)
                .populate('products.product')
                .lean();
            
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }
            
            res.json({
                status: 'success',
                payload: cart
            });
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al obtener el carrito',
                error: error.message
            });
        }
    }
    
    async createCart(req, res) {
        try {
            const newCart = await CartModel.create({ products: [] });
            
            res.status(201).json({
                status: 'success',
                message: 'Carrito creado correctamente',
                payload: newCart
            });
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al crear el carrito',
                error: error.message
            });
        }
    }
    
    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity || 1;
            
            // Verificar que el carrito exista
            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }
            
            // Buscar si el producto ya existe en el carrito
            const productIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );
            
            if (productIndex !== -1) {
                // Si el producto ya existe, incrementar la cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                // Si el producto no existe, agregarlo
                cart.products.push({
                    product: pid,
                    quantity
                });
            }
            
            await cart.save();
            
            res.json({
                status: 'success',
                message: 'Producto agregado al carrito correctamente',
                payload: cart
            });
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al agregar producto al carrito',
                error: error.message
            });
        }
    }
    
    async updateCart(req, res) {
        try {
            const { cid } = req.params;
            const { products } = req.body;
            
            // Verificar que products sea un array
            if (!Array.isArray(products)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El formato de productos no es válido'
                });
            }
            
            // Actualizar el carrito completo
            const updatedCart = await CartModel.findByIdAndUpdate(
                cid,
                { products },
                { new: true }
            ).populate('products.product');
            
            if (!updatedCart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }
            
            res.json({
                status: 'success',
                message: 'Carrito actualizado correctamente',
                payload: updatedCart
            });
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al actualizar el carrito',
                error: error.message
            });
        }
    }
    
    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            
            if (!quantity || isNaN(quantity) || quantity < 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'La cantidad debe ser un número positivo'
                });
            }
            
            // Buscar el carrito
            const cart = await CartModel.findById(cid);
            if (!cart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }
            
            // Buscar el producto en el carrito
            const productIndex = cart.products.findIndex(
                item => item.product.toString() === pid
            );
            
            if (productIndex === -1) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado en el carrito'
                });
            }
            
            // Actualizar la cantidad
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            
            res.json({
                status: 'success',
                message: 'Cantidad de producto actualizada correctamente',
                payload: cart
            });
        } catch (error) {
            console.error('Error al actualizar cantidad de producto:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al actualizar cantidad de producto',
                error: error.message
            });
        }
    }
    
    async removeProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            
            // Actualizar el carrito eliminando el producto
            const updatedCart = await CartModel.findByIdAndUpdate(
                cid,
                { $pull: { products: { product: pid } } },
                { new: true }
            ).populate('products.product');
            
            if (!updatedCart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }
            
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                payload: updatedCart
            });
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al eliminar producto del carrito',
                error: error.message
            });
        }
    }
    
    async clearCart(req, res) {
        try {
            const { cid } = req.params;
            
            // Vaciar el carrito manteniendo su ID
            const updatedCart = await CartModel.findByIdAndUpdate(
                cid,
                { products: [] },
                { new: true }
            );
            
            if (!updatedCart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado'
                });
            }
            
            res.json({
                status: 'success',
                message: 'Carrito vaciado correctamente',
                payload: updatedCart
            });
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al vaciar el carrito',
                error: error.message
            });
        }
    }
}

export default new CartController();