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
exports.OrdersService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const products_model_1 = require("../products/products.model");
const orders_model_1 = require("./orders.model");
const uuid_1 = require("uuid");
const payment_model_1 = require("../payment/payment.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createOrder = (orderData, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (orderData.customer.toString() !== user.id) {
        throw new AppError_1.default(401, "You can't create order for another customer");
    }
    const product = yield products_model_1.Product.findOne({
        _id: orderData.product,
        is_deleted: false,
    });
    if (!product) {
        throw new Error('Product not found');
    }
    if (product.quantity < orderData.quantity) {
        throw new AppError_1.default(400, 'Insufficient stock');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const opts = { session };
        product.quantity -= orderData.quantity;
        yield product.save(opts);
        const transaction_id = `TXN-${(0, uuid_1.v4)().slice(0, 8)}`;
        orderData.sub_total = product.price * orderData.quantity;
        orderData.shipping_charge = 70;
        orderData.grand_total = orderData.sub_total + orderData.shipping_charge;
        orderData.transaction_id = transaction_id;
        const order = yield orders_model_1.Orders.create([orderData], opts);
        yield payment_model_1.Payment.create([
            {
                order_id: order[0]._id,
                transaction_id,
                amount: orderData.grand_total,
            },
        ], opts);
        yield session.commitTransaction();
        session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getMyOrders = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(orders_model_1.Orders.find({ customer: user.id }), query);
    const orders = yield queryBuilder
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
    const total = yield queryBuilder.getCountQuery();
    return {
        meta: Object.assign({ total }, queryBuilder.getPaginationInfo()),
        data: orders,
    };
});
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(orders_model_1.Orders.find(), query);
    const orders = yield queryBuilder
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
    const total = yield queryBuilder.getCountQuery();
    return {
        meta: Object.assign({ total }, queryBuilder.getPaginationInfo()),
        data: orders,
    };
});
exports.OrdersService = { createOrder, getMyOrders, getAllOrders };
