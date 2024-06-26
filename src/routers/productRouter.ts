import { Router } from 'express';
import ProductService from '../services/productsService';
import { Product } from '../interfaces/productInterface';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';

export const ProductRouter = Router();
const productService = new ProductService();

ProductRouter.get('/', async (req, res) => {
  const response = await productService.getAllProducts();

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(200).send(response.data);
      break;
    case RESPONSE_MESSAGE.NO_ITEMS_FOUND:
      res.status(404).send(RESPONSE_MESSAGE.NO_ITEMS_FOUND);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});

ProductRouter.get('/type/:product_type', async (req, res) => {
  let product_type = req.params['product_type'];
  const response = await productService.getProductsByType(product_type);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(200).send(response.data);
      break;
    case RESPONSE_MESSAGE.NOT_FOUND:
      res.status(404).send(RESPONSE_MESSAGE.NOT_FOUND);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});

ProductRouter.get('/:product', async (req, res) => {
  let product_name = req.params['product'];
  const response = await productService.getProductByName(product_name);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(200).send(response.data);
      break;
    case RESPONSE_MESSAGE.NOT_FOUND:
      res.status(404).send(RESPONSE_MESSAGE.NOT_FOUND);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});

ProductRouter.post('/', async (req, res) => {
  const product_name: string = req.body.product;
  const product_type: string = req.body.product_type;

  let product: Product = {
    product: product_name,
    product_type: product_type
  }

  const response = await productService.createProduct(product);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(200).send(response.data);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});

ProductRouter.put('/', async (req, res) => {
  const product_name = req.body.product;
  const product_type = req.body.product_type;

  const product = {
    product: product_name,
    product_type: product_type
  }

  const successCode = await productService.checkProductExists(product_name) ? 200 : 201;

  const response = await productService.putProduct(product);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(successCode).send(response.data);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});

ProductRouter.delete('/:product_name', async (req, res) => {
  const product_name = req.params['product_name'];

  const response = await productService.deleteProduct(product_name);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(204).send();
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});