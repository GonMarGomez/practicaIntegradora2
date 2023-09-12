import { Router } from "express";
import { uploader } from "../../utils/multerUtil.js";
import { productDBService } from "../../dao/productDBservice.js";

const router = Router();

//const productService = new productFSService('Products.json')
const productService = new productDBService();

router.get('/', async (req, res)=>{
  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page);
  const sort= req.query.sort;
  const category = req.query.category;
  const status = req.query.status;

    const products = await productService.getAllProducts(limit, sort, category, status, page);
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

    res.send(response)
});

router.get('/:pid', async(req,res)=>{
  const product = await productService.getProductById(req.params.pid);
  if(!product){
    return res.status(404).send({error: 'Producto no encontrado'})
  }
  res.send({product});
})
router.post('/',uploader.array('thumbnails', 3), async(req, res)=>{

    if(req.files){
        req.body.thumbnails = []
      req.files.forEach((file)=>{
        req.body.thumbnails.push(file.filename)
      })
    }

    const result = await productService.createProduct(req.body);
    res.send({
       status: 'success',
        messsage: result
    });
});
router.put('/:pid', async (req,res)=>{
  const productId = req.params.pid;
  const update = req.body;

  const product = await productService.getProductById(productId);
  if(!product){
    return res.status(404).send({Error:'producto no encontrado'})
  }
  await productService.updateProduct(productId, update);
  const updatedProduct = await productService.getProductById(productId)
  res.send({updatedProduct})
});

router.delete('/:pid', async(req,res)=>{
  const productId = req.params.pid;
  const product = await productService.deleteProduct(productId)

  res.send({product, message:`El producto con Id ${productId} fue eliminado` })
});

export default router;