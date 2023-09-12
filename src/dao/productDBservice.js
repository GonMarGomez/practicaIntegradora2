import fs from 'fs';
import { productModel } from '../modules/productModel.js';

class productDBService {

    async getAllProducts() {
        try {
            const products = await productModel.find();
            return products
        } catch (error) {
            console.error(error.message);
            return []; 
        }
    }

    async createProduct(product) {
        const {title, description, code, price, stock, category, thumbnails} = product;

        if (!title || !description || !code || !price || !stock || !category) {
            return 'Error al crear el producto';
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails ?? []
        }


        try {
            const result = await productModel.create(newProduct)

            return 'Producto creado correctamente';
        } catch (error) {
            console.error(error.message);
            return 'Error al crear el producto';
        }
    }
    async getProducts(limit, order, category, status, page) {
      if (!limit) {
        limit = 10;
      }
      if (!page) {
          page = 1;
      }
  
      const filters = {};
      if (category) {
        filters.category = category;
      }
      if (status !== undefined) {
        filters.status = status;
      }
  
      const sortOptions = {};
      if (order === 'asc') {
        sortOptions.price = 1;
      } else if (order === 'desc') {
        sortOptions.price = -1;
      }
        const products =await productModel.paginate(filters, {
          page,
          limit,
          lean: true,
          sort: sortOptions,
        });
        
        if (products.length < 1) {
          return [];
        }else{
          try {
            return products;
          } catch (err) {
            console.error('Error al leer el archivo de productos:', err);
            return [];
          }}
        }
    
        async getProductById(_id) {
          try {
            const product = await productModel.find({_id});  
            if (product) {
              return product;
            } else {
              console.error('Producto no encontrado');
              return null;
            }
          } catch (err) {
            console.error('Error al leer el archivo de productos:', err);
            return null;
          }
      }
    
      async updateProduct(_id, product) {
        try{
          const products = await productModel.find({_id});
          let productUpdated = {};
      
          for (let key in products) {
              if (products[key].id == _id) {
                products[key].title = product.title ? product.title : products[key].title;
                products[key].description = product.description ? product.description : products[key].description;
                products[key].price = product.price ? product.price : products[key].price;
                products[key].code = product.code ? product.code : products[key].code;
                products[key].stock = product.stock ? product.stock : products[key].stock;
                products[key].category = product.category ? product.category : products[key].category;
                products[key].thumbnails = product.thumbnails ? product.thumbnails : products[key].thumbnails;
                if (product.status !== undefined) {
                  products[key].status = typeof product.status === 'string' ? product.status === 'true' : Boolean(product.status);
                }
      
                productUpdated = products[key];
              }
          }
          const result = await productModel.updateOne({_id}, productUpdated);
          return result;
        } catch (err) {
          console.error('Error al actualizar el producto:', err);
          throw err; 
        }
      }
    
      async deleteProduct(_id) {
        try {
          const result = await productModel.deleteOne({_id});
          return result
        }catch (err) {
          console.error('Error al leer el archivo de productos:', err);
        }
      }
    }
    

export { productDBService };