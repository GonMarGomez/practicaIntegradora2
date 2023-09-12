import { Router } from "express";
import { productDBService } from "../dao/productDBservice.js";
import CartDBManager from "../dao/cartDBService.js";
const router = Router();
const productManager = new productDBService();
const cartManager = new CartDBManager();

router.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const sort= req.query.sort;
    const category = req.query.category;
    const status = req.query.status;

    const products = await productManager.getProducts(limit, sort, category, status, page);
    console.log(products);
    const queryParams = new URLSearchParams();
    if (limit) queryParams.set('limit', limit);
    if (sort) queryParams.set('sort', sort);
    if (category) queryParams.set('category', category);
    if (status) queryParams.set('status', status);

    const queryString = queryParams.toString();

    const response = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&${queryString}` : '',
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&${queryString}` : '',
    };

    res.render(
        'products',
        {
            style: "products.css",
            products: response 
        }
    );
});

let cart = {};

router.post('/addToCart', async (req, res) => {
    const productId = req.body.productId;
    const product = await productManager.getProductById(productId);

    if (Object.keys(cart).length === 0) {
        cart = await cartManager.createCart();
        await cartManager.addProductToCart(cart._id.toString(), product, 1)
    }else{
        await cartManager.addProductToCart(cart._id.toString(), product, 1);
    }    

    res.status(204).send();
});

router.get('/chat', async (req, res) => {

    res.render(
        'chat',
        {
            style: "chat.css",
        }
    )
})

router.get('/cart/:cid', async (req, res) => {
    const cart= await cartManager.getCartById(req.params.cid)

    const cartId = cart[0]._id.toString();

    const products = cart[0].products.map((item) => ({
        title: item.product.title,
        description: item.product.description,
        price: item.product.price,
        id: item.product._id,
        quantity: item.quantity,
    }));

    res.render(
        'cart',
        {
            style: "cart.css",
            cartId: cartId,
            products: products,
        }
    )
})

export default router;