import { Router } from 'express';
import CartDBManager from '../../dao/cartDBService.js';
import { productDBService } from '../../dao/productDBservice.js';

const router = Router();

const cartManager = new CartDBManager();
const productDBManager = new productDBService();

router.post('/', async (req, res) => {
    const cart = await cartManager.createCart();

    res.send({ cart });
});

router.get('/:cid', async (req, res) => {
    const cartProducts = await cartManager.getCartById(req.params.cid);
    if (!cartProducts) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    res.send({cartProducts});
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

    const product = await productDBManager.getProductById(productId);
        if (!product) {
            return res.status(404).send({ error: 'Producto no encontrado' });
        }

        await cartManager.addProductToCart(cartId, productId, 1);

        res.send(cart);
});

router.put('/:cid', async (req,res)=>{
    const cartId = req.params.cid;
    const newCart = req.body;

    const result = await cartManager.updateCart(cartId, newCart);
    if(result.error){
        return res.status(400).send({error: result.error});
    }
    res.send(result)
});

router.put('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity; 

    const result = await cartManager.updateQuantity(cartId, productId, newQuantity);

    if (result.error) {
        return res.status(404).send({ error: result.error });
    }

    res.send(result);
});
router.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const result = await cartManager.deleteProductFromCart(cartId, productId);

    if (result.error) {
        return res.status(404).send({ error: result.error });
    }

    res.send(result);
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const result = await cartManager.deleteAllProductsFromCart(cartId);

    if (result.error) {
        return res.status(404).send({ error: result.error });
    }

    res.send(result);
});

export default router;