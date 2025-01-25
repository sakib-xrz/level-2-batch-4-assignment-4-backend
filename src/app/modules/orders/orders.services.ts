import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Product } from '../products/products.model';
import { OrdersInterface } from './orders.interface';
import { Orders } from './orders.model';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from '../payment/payment.model';

async function createOrder(orderData: OrdersInterface) {
  const product = await Product.findById(orderData.product);
  if (!product) {
    throw new Error('Product not found');
  }
  if (product.quantity < orderData.quantity) {
    throw new AppError(400, 'Insufficient stock');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const opts = { session };
    product.quantity -= orderData.quantity;
    await product.save(opts);

    orderData.sub_total = product.price * orderData.quantity;
    orderData.shipping_charge = 70;
    orderData.grand_total = orderData.sub_total + orderData.shipping_charge;

    const order = await Orders.create([orderData], opts);

    const transaction_id = `TXN-${uuidv4()}`;

    await Payment.create(
      [
        {
          order_id: order[0]._id,
          transaction_id,
          amount: orderData.grand_total,
        },
      ],
      opts,
    );

    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

const getRevenue = async () => {
  const result = await Orders.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  return result[0] || { totalRevenue: 0 };
};

export const OrdersService = { createOrder, getRevenue };
