import AppError from '../../errors/AppError';
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

const getAllProducts = async (query: Record<string, unknown>) => {
  const {
    search,
    priceRange,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
    fields,
    ...restFilters
  } = query;

  const filterConditions: Record<string, unknown> = { ...restFilters };

  // Convert specific filters to their appropriate types or formats
  Object.keys(filterConditions).forEach((key) => {
    if (filterConditions[key] === 'true' || filterConditions[key] === 'false') {
      filterConditions[key] = filterConditions[key] === 'true';
    }
  });

  // Search functionality
  if (search) {
    filterConditions.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  // Price range filter
  if (priceRange) {
    const [minPrice, maxPrice] = (priceRange as string).split('-').map(Number);
    filterConditions.price = { $gte: minPrice, $lte: maxPrice };
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Sorting
  const sortCondition =
    sortBy && sortOrder
      ? `${sortOrder === 'asc' ? '' : '-'}${sortBy}`
      : '-createdAt';

  // Field selection
  const projection = fields ? (fields as string).split(',').join(' ') : '-__v';

  const [data, total] = await Promise.all([
    Product.find(filterConditions)
      .sort(sortCondition)
      .skip(skip)
      .limit(Number(limit))
      .select(projection),

    Product.countDocuments(filterConditions),
  ]);

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
    data,
  };
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
