import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import ProductsValidation from './products.validation';
import { ProductsController } from './products.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router
  .route('/')
  .post(
    auth('ADMIN'),
    validateRequest(ProductsValidation.CreateValidation),
    ProductsController.createProduct,
  )
  .get(ProductsController.getAllProducts);

router
  .route('/multiple')
  .post(
    auth('ADMIN'),
    validateRequest(ProductsValidation.CreateMultipleValidation),
    ProductsController.createProducts,
  );

router
  .route('/:id')
  .get(ProductsController.getProductById)
  .patch(
    validateRequest(ProductsValidation.UpdateValidation),
    ProductsController.updateProduct,
  )
  .delete(ProductsController.deleteProduct);

export const ProductsRoutes = router;
