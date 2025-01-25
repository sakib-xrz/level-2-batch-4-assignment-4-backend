import { Request, Response } from 'express';
import { ProductsService } from './products.services';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const productData = req.body;
  const result = await ProductsService.createProduct(productData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Bicycle created successfully',
    data: result,
  });
});

const createProducts = catchAsync(async (req: Request, res: Response) => {
  const productsData = req.body;
  const result = await ProductsService.createProducts(productsData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Bicycles created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const result = await ProductsService.getAllProducts(searchTerm as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bicycles retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductsService.getProductById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bicycle retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const productData = req.body;
  const result = await ProductsService.updateProduct(id, productData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bicycle updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ProductsService.deleteProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bicycle deleted successfully',
    data: {},
  });
});

export const ProductsController = {
  createProduct,
  createProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
