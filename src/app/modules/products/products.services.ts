import AppError from '../../errors/AppError';
import { ProductsInterface } from './products.interface';
import { Product } from './products.model';

const createProduct = async (productData: ProductsInterface) => {
  const product = new Product(productData);
  await product.save();
  return product.toObject();
};

const createProducts = async (productsData: ProductsInterface[]) => {
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

  Object.keys(filterConditions).forEach((key) => {
    if (filterConditions[key] === 'true' || filterConditions[key] === 'false') {
      filterConditions[key] = filterConditions[key] === 'true';
    }
  });

  if (search) {
    filterConditions.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (priceRange) {
    const [minPrice, maxPrice] = (priceRange as string).split('-').map(Number);
    filterConditions.price = { $gte: minPrice, $lte: maxPrice };
  }

  filterConditions.is_deleted = false;

  const skip = (Number(page) - 1) * Number(limit);

  const sortCondition =
    sortBy && sortOrder
      ? `${sortOrder === 'asc' ? '' : '-'}${sortBy}`
      : '-createdAt';

  // Field selection
  const projection = fields
    ? (fields as string).split(',').join(' ')
    : '-__v -createdAt -updatedAt -is_deleted';

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
  const result = await Product.findOne({ _id: productId, is_deleted: false })
    .select('-__v -createdAt -updatedAt -is_deleted')
    .lean();

  if (!result) {
    throw new AppError(404, 'Bicycle not found');
  }

  return result;
};

const updateProduct = async (
  productId: string,
  updates: Partial<ProductsInterface>,
) => {
  const isProductExists = await Product.findById(productId);

  if (!isProductExists || isProductExists.is_deleted) {
    throw new AppError(404, 'Bicycle not found');
  }

  const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
    new: true,
    runValidators: true,
  });

  return updatedProduct;
};

const deleteProduct = async (productId: string) => {
  const result = await Product.findByIdAndUpdate(productId, {
    is_deleted: true,
  });

  if (!result) {
    throw new AppError(404, 'Bicycle not found');
  }

  return result;
};

const getMinAndMaxPrice = async () => {
  const [minPrice, maxPrice] = await Promise.all([
    Product.findOne({ is_deleted: false }).sort('price').select('price'),
    Product.findOne({ is_deleted: false }).sort('-price').select('price'),
  ]);

  return {
    minPrice: minPrice?.price || 0,
    maxPrice: maxPrice?.price || 0,
  };
};

export const ProductsService = {
  createProduct,
  createProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMinAndMaxPrice,
};
