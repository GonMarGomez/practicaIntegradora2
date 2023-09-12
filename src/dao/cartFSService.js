import fs from "fs";

class CartManager {
    constructor(filePath) {
        this.carts = [];
        this.lastId = 0;
        this.path = filePath;
    }

    async createCart() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            this.carts = JSON.parse(data);
        } catch (err) {
            this.carts = [];
        }

        const lastCartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;
        const id = lastCartId + 1;

        if (typeof products === 'string') {
            products = [products];
        }

        const cart = {
            id,
            products: [],
        };

        this.carts.push(cart);
        
        const cartsData = JSON.stringify(this.carts)
        try {
            await fs.promises.writeFile(this.path, cartsData);
            } catch (err) {
            console.error("Error al guardar los carritos en el archivo:", err);
            }
    }

    async getCartById(_id) {
        const id = parseInt(_id)

        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            const carts = JSON.parse(data);
            this.carts = carts;
        
            const cart = this.carts.find((cart) => cart.id === id);
            if (cart) {
                console.log(cart);
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

    async addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find((cart) => cart.id === cartId);
        if (!cart) {
            console.error("Carrito no encontrado");
        return;
        }

        const existingProduct = cart.products.find(
        (product) => product.product === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
            } catch (err) {
            console.error("Error al guardar los carritos en el archivo:", err);
            }
    }
}

    export default CartManager;