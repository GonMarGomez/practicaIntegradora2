import { Router } from "express";
import cartRouter from './routers/cartRouter.js'
import viewsChat from './routers/viewsChat.js'
import productRouter from './routers/productRouter.js'

const router = Router();

router.use('/products', productRouter)
router.use('/cart', cartRouter)
router.use('/chat', viewsChat)

export default router
