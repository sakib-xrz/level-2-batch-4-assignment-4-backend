import AppError from '../../errors/AppError';
import { productsSearchableFields } from './products.constant';
import { ProductsInterface } from './products.interface';
import { Product } from './products.model';

export const createProduct = async (productData: ProductsInterface) => {
  const product = new Product(productData);
  await product.save();
  return product.toObject();
};

export const createProducts = async (productsData: ProductsInterface[]) => {
  const products = await Product.insertMany(productsData);
  return products;
};

const getAllProducts = async (searchTerm: string) => {
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: productsSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Product.find(whereConditions);
  const total = await Product.countDocuments(whereConditions);
  return { meta: { total }, data: result };
};

const getProductById = async (productId: string) => {
  const result = await Product.findById(productId).lean();

  if (!result) {
    throw new AppError(404, 'Bicycle not found');
  }

  return result;
};

export const updateProduct = async (
  productId: string,
  updates: Partial<ProductsInterface>,
) => {
  const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    throw new AppError(404, 'Bicycle not found');
  }

  return updatedProduct;
};

export const deleteProduct = async (productId: string) => {
  const result = await Product.findByIdAndDelete(productId);

  if (!result) {
    throw new AppError(404, 'Bicycle not found');
  }

  return result;
};

export const ProductsService = {
  createProduct,
  createProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
