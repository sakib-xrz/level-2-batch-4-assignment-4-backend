import { Request, Response } from 'express';
import { OrdersService } from './orders.services';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;
  const result = await OrdersService.createOrder(orderData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getRevenue = catchAsync(async (_req: Request, res: Response) => {
  const result = await OrdersService.getRevenue();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue fetched successfully',
    data: result,
  });
});

export const OrdersController = { createOrder, getRevenue };
