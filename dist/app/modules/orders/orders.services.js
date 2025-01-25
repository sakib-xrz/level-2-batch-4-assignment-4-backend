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
function createOrder(orderData) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield products_model_1.Product.findById(orderData.product);
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
            orderData.sub_total = product.price * orderData.quantity;
            orderData.shipping_charge = 70;
            orderData.grand_total = orderData.sub_total + orderData.shipping_charge;
            const order = yield orders_model_1.Orders.create([orderData], opts);
            const transaction_id = `TXN-${(0, uuid_1.v4)()}`;
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
}
const getRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orders_model_1.Orders.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalPrice' },
            },
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
            },
        },
    ]);
    return result[0] || { totalRevenue: 0 };
});
exports.OrdersService = { createOrder, getRevenue };
