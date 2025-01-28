import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrdersValidation } from './orders.validation';
import { OrdersController } from './orders.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router
  .route('/')
  .post(
    auth('CUSTOMER', 'ADMIN'),
    validateRequest(OrdersValidation.CreateValidation),
    OrdersController.createOrder,
  )
  .get(auth('ADMIN'), OrdersController.getAllOrders);

router.get(
  '/my-orders',
  auth('CUSTOMER', 'ADMIN'),
  OrdersController.getMyOrders,
);

router.patch(
  '/:order_id/status',
  auth('ADMIN'),
  OrdersController.chnageOrderStatus,
);

router.delete('/:order_id', auth('ADMIN'), OrdersController.deleteOrder);

export const OrdersRoutes = router;
