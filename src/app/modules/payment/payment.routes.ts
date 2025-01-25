import express from 'express';
import auth from '../../middlewares/auth';
import PaymentController from './payment.controller';

const router = express.Router();

router.get('/');

router.post(
  '/intent/:order_id',
  auth('CUSTOMER', 'ADMIN'),
  PaymentController.CreatePaymentIntent,
);

router.post('/ipn_listener', PaymentController.VerifyPayment);

export const PaymentRoutes = router;
