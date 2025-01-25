import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrdersValidation } from './orders.validation';
import { OrdersController } from './orders.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('CUSTOMER', 'ADMIN'),
  validateRequest(OrdersValidation.CreateValidation),
  OrdersController.createOrder,
);

router.get('/revenue', OrdersController.getRevenue);

export const OrdersRoutes = router;
