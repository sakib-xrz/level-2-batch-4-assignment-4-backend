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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = exports.deleteProduct = exports.updateProduct = exports.createProducts = exports.createProduct = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const products_constant_1 = require("./products.constant");
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
const getAllProducts = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: products_constant_1.productsSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield products_model_1.Product.find(whereConditions);
    const total = yield products_model_1.Product.countDocuments(whereConditions);
    return { meta: { total }, data: result };
});
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.Product.findById(productId).lean();
    if (!result) {
        throw new AppError_1.default(404, 'Bicycle not found');
    }
    return result;
});
const updateProduct = (productId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProduct = yield products_model_1.Product.findByIdAndUpdate(productId, updates, {
        new: true,
        runValidators: true,
    });
    if (!updatedProduct) {
        throw new AppError_1.default(404, 'Bicycle not found');
    }
    return updatedProduct;
});
exports.updateProduct = updateProduct;
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.Product.findByIdAndDelete(productId);
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
