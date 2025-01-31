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

router.get('/price-range', ProductsController.getMinAndMaxPrice);

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
    auth('ADMIN'),
    validateRequest(ProductsValidation.UpdateValidation),
    ProductsController.updateProduct,
  )
  .delete(auth('ADMIN'), ProductsController.deleteProduct);

export const ProductsRoutes = router;
