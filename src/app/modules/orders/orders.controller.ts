import { Request, Response } from 'express';
import { OrdersService } from './orders.services';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const user = req.user;
  const result = await OrdersService.createOrder(orderData, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await OrdersService.getMyOrders(user, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My orders fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrdersService.getAllOrders(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const chnageOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const { status } = req.body;
  const result = await OrdersService.chnageOrderStatus(order_id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { order_id } = req.params;
  await OrdersService.deleteOrder(order_id);

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Order deleted successfully',
  });
});

export const OrdersController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  chnageOrderStatus,
  deleteOrder,
};
