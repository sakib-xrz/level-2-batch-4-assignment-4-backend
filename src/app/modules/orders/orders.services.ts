import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Product } from '../products/products.model';
import { OrdersInterface } from './orders.interface';
import { Orders } from './orders.model';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from '../payment/payment.model';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';

const createOrder = async (orderData: OrdersInterface, user: JwtPayload) => {
  if (orderData.customer.toString() !== user.id) {
    throw new AppError(401, "You can't create order for another customer");
  }

  const product = await Product.findOne({
    _id: orderData.product,
    is_deleted: false,
  });

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

    const transaction_id = `TXN-${uuidv4().slice(0, 8)}`;

    orderData.sub_total = product.price * orderData.quantity;
    orderData.shipping_charge = 70;
    orderData.grand_total = orderData.sub_total + orderData.shipping_charge;
    orderData.transaction_id = transaction_id;

    const order = await Orders.create([orderData], opts);

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
};

const getMyOrders = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const queryBuilder = new QueryBuilder(
    Orders.find({ customer: user.id }),
    query,
  );

  const orders = await queryBuilder
    .search(['phone', 'transaction_id'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.populate({
      path: 'product',
      select: 'name price image brand category product_model',
    })
    .populate({
      path: 'customer',
      select: 'name email',
    });

  const total = await queryBuilder.getCountQuery();

  return {
    meta: {
      total,
      ...queryBuilder.getPaginationInfo(),
    },
    data: orders,
  };
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(Orders.find(), query);

  const orders = await queryBuilder
    .search(['phone', 'transaction_id'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.populate({
      path: 'product',
      select: 'name price image brand category product_model',
    })
    .populate({
      path: 'customer',
      select: 'name email',
    });

  const total = await queryBuilder.getCountQuery();

  return {
    meta: {
      total,
      ...queryBuilder.getPaginationInfo(),
    },
    data: orders,
  };
};

export const OrdersService = { createOrder, getMyOrders, getAllOrders };
