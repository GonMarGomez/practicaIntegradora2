import { productModel } from "../modules/productModel.js";
import { cartModel } from "../modules/cartModel.js";

class CartDBManager {

    async createCart() {
        const cart = {
            products: [],
        };
        
        try {
            const createCart = await cartModel.create(cart);
            return createCart;
            } catch (err) {
            console.error("Error al guardar los carritos en el archivo:", err);
            }
    }

    async getCartById(_id) {
        try {
            const cart = await cartModel.find({_id});

            if (cart) {
                return cart;
            } else {
                console.error('Producto no encontrado');
                return null;
            }
        } catch (err) {
            console.error('Error al leer el archivo de productos:', err);
            return null;
        }
    }

    async addProductToCart(cartId, product, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                console.error("Carrito no encontrado");
                return;
            }
            console.log(product);
            const existingProduct = cart.products.find(item => item.product.toString() === product[0]._id.toString());
    
            if (existingProduct) {
                await cartModel.updateOne(
                    { _id: cartId, 'products.product': product[0]._id },
                    { $set: { 'products.$.quantity': existingProduct.quantity + 1 } }
                );
            } else {
                await cartModel.updateOne(
                    { _id: cartId },
                    { $push: { products: { product: product[0], quantity: quantity } } }
                );
            }
        } catch (err) {
            console.error("Error al guardar los carritos en el archivo:", err);
        }
    }
    async updateCart(cartId, newCart) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }
    
            await cartModel.updateOne(
                { _id: cartId },
                { $set: { products: newCart.products } }
            );
    
            return { message: 'Carrito actualizado correctamente' };
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
        }
    }

    async updateQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }
    
            const productToUpdate = cart.products.find(item => item.product.toString() === productId);
            if (!productToUpdate) {
                return { error: 'Producto no encontrado en el carrito' };
            }
    
            await cartModel.updateOne(
                { _id: cartId, 'products.product': productId },
                { $set: { 'products.$.quantity': newQuantity } }
            );
    
            return { message: 'Cantidad de ejemplares actualizada correctamente' };
        } catch (error) {
            console.error('Error al actualizar la cantidad de ejemplares del producto en el carrito:', error);
        }
    }

    async deleteProductFromCart(cartId, productId){
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }
            
            const productToRemove = cart.products.find(item => item.product.toString() === productId);
            if (!productToRemove) {
                return { error: 'Producto no encontrado en el carrito' };
            }
    
            await cartModel.updateOne(
                { _id: cartId },
                { $pull: { products: { product: productId } } }
            );
    
            return { message: 'Producto eliminado del carrito correctamente' };
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }
    
            if (cart.products.length === 0) {
                return { error: 'El carrito ya esta vacío' };
            }

            await cartModel.updateOne(
                { _id: cartId },
                { $set: { products: [] } }
            );
    
            return { message: 'Todos los productos han sido eliminados del carrito correctamente' };
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error);
        }
    }
}

    export default CartDBManager;