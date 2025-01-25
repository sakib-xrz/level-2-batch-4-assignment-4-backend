"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = exports.deleteProduct = exports.updateProduct = exports.createProducts = exports.createProduct = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const products_model_1 = require("./products.model");
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const product = new products_model_1.Product(productData);
    yield product.save();
    return product.toObject();
});
exports.createProduct = createProduct;
const createProducts = (productsData) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield products_model_1.Product.insertMany(productsData);
    return products;
});
exports.createProducts = createProducts;
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, priceRange, sortBy, sortOrder, page = 1, limit = 10, fields } = query, restFilters = __rest(query, ["search", "priceRange", "sortBy", "sortOrder", "page", "limit", "fields"]);
    const filterConditions = Object.assign({}, restFilters);
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
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        filterConditions.price = { $gte: minPrice, $lte: maxPrice };
    }
    filterConditions.is_deleted = false;
    const skip = (Number(page) - 1) * Number(limit);
    const sortCondition = sortBy && sortOrder
        ? `${sortOrder === 'asc' ? '' : '-'}${sortBy}`
        : '-createdAt';
    // Field selection
    const projection = fields
        ? fields.split(',').join(' ')
        : '-__v -createdAt -updatedAt -is_deleted';
    const [data, total] = yield Promise.all([
        products_model_1.Product.find(filterConditions)
            .sort(sortCondition)
            .skip(skip)
            .limit(Number(limit))
            .select(projection),
        products_model_1.Product.countDocuments(filterConditions),
    ]);
    return {
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
        },
        data,
    };
});
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.Product.findOne({ _id: productId, is_deleted: false })
        .select('-__v -createdAt -updatedAt -is_deleted')
        .lean();
    if (!result) {
        throw new AppError_1.default(404, 'Bicycle not found');
    }
    return result;
});
const updateProduct = (productId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExists = yield products_model_1.Product.findById(productId);
    if (!isProductExists || isProductExists.is_deleted) {
        throw new AppError_1.default(404, 'Bicycle not found');
    }
    const updatedProduct = yield products_model_1.Product.findByIdAndUpdate(productId, updates, {
        new: true,
        runValidators: true,
    });
    return updatedProduct;
});
exports.updateProduct = updateProduct;
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.Product.findByIdAndUpdate(productId, {
        is_deleted: true,
    });
    if (!result) {
        throw new AppError_1.default(404, 'Bicycle not found');
    }
    return result;
});
exports.deleteProduct = deleteProduct;
exports.ProductsService = {
    createProduct: exports.createProduct,
    createProducts: exports.createProducts,
    getAllProducts,
    getProductById,
    updateProduct: exports.updateProduct,
    deleteProduct: exports.deleteProduct,
};
