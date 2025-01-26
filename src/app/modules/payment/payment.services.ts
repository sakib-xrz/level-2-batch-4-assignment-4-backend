// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Orders } from '../orders/orders.model';
import { Payment } from './payment.model';
import SSLCommerzPayment from 'sslcommerz-lts';
import { updatePaymentAndOrderStatus } from './payment.utils';

const store_id = config.ssl.store_id;
const store_passwd = config.ssl.store_pass;
const is_live = false;

const CreatePaymentIntent = async (order_id: string) => {
  const order = await Orders.findById(order_id).populate('customer');

  if (!order) {
    throw new Error('Order not found');
  }

  const payment = await Payment.findOne({
    order_id,
  });

  if (!payment) {
    throw new Error('Payment info not found');
  }

  if (payment.status === 'PAID') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment already completed');
  }

  const data = {
    total_amount: payment.amount,
    currency: 'BDT',
    tran_id: payment.transaction_id,
    success_url: `${config.backend_base_url}/payment/ipn_listener`,
    fail_url: `${config.backend_base_url}/payment/ipn_listener`,
    cancel_url: `${config.backend_base_url}/payment/ipn_listener`,
    ipn_url: `${config.backend_base_url}/payment/ipn_listener`,
    shipping_method: 'N/A',
    product_name: 'Bicycle',
    product_category: 'N/A',
    product_profile: 'N/A',
    cus_name: order.customer.name,
    cus_email: order.customer.email,
    cus_add1: order.delivery_address,
    cus_add2: 'N/A',
    cus_city: 'N/A',
    cus_state: 'N/A',
    cus_postcode: 'N/A',
    cus_country: 'N/A',
    cus_phone: order.phone,
    cus_fax: 'N/A',
    ship_name: 'N/A',
    ship_add1: 'N/A',
    ship_add2: 'N/A',
    ship_city: 'N/A',
    ship_state: 'N/A',
    ship_postcode: 'N/A',
    ship_country: 'N/A',
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const sslResponse = await sslcz.init(data);

  return sslResponse.GatewayPageURL;
};

const VerifyPayment = async (payload) => {
  if (!payload.val_id || payload.status !== 'VALID') {
    if (payload.status === 'FAILED') {
      await updatePaymentAndOrderStatus(
        payload.transaction_id,
        'FAILED',
        'FAILED',
      );
      return `${config.frontend_base_url}/${config.payment.fail_url}`;
    }

    if (payload.status === 'CANCELLED') {
      await updatePaymentAndOrderStatus(
        payload.transaction_id,
        'CANCELLED',
        'CANCELLED',
      );
      return `${config.frontend_base_url}/${config.payment.cancel_url}`;
    }

    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid IPN request');
  }

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const response = await sslcz.validate({
    val_id: payload.val_id,
  });

  console.log('response', response);

  if (response.status !== 'VALID') {
    await updatePaymentAndOrderStatus(response.tran_id, 'FAILED', 'FAILED');
    return `${config.frontend_base_url}/${config.payment.fail_url}`;
  }

  await updatePaymentAndOrderStatus(response.tran_id, 'PAID', 'PAID', response);

  return `${config.frontend_base_url}/${config.payment.success_url}`;
};

const PaymentService = { CreatePaymentIntent, VerifyPayment };

export default PaymentService;
