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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const orders_model_1 = require("../orders/orders.model");
const payment_model_1 = require("./payment.model");
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const store_id = config_1.default.ssl.store_id;
const store_passwd = config_1.default.ssl.store_pass;
const is_live = false;
const CreatePaymentIntent = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orders_model_1.Orders.findById(order_id).populate('customer');
    if (!order) {
        throw new Error('Order not found');
    }
    const payment = yield payment_model_1.Payment.findOne({
        order_id,
    });
    if (!payment) {
        throw new Error('Payment info not found');
    }
    if (payment.status === 'PAID') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Payment already completed');
    }
    const data = {
        total_amount: payment.amount,
        currency: 'BDT',
        tran_id: payment.transaction_id,
        success_url: `${config_1.default.backend_base_url}/payment/ipn_listener`,
        fail_url: `${config_1.default.backend_base_url}/payment/ipn_listener`,
        cancel_url: `${config_1.default.backend_base_url}/payment/ipn_listener`,
        ipn_url: `${config_1.default.backend_base_url}/payment/ipn_listener`,
        shipping_method: 'N/A',
        product_name: 'Appointment',
        product_category: 'N/A',
        product_profile: 'N/A',
        cus_name: order.customer.name,
        cus_email: order.customer.email,
        cus_add1: order.delivery_address,
        cus_add2: 'N/A',
        cus_city: 'N/A',
        cus_state: 'N/A',
        cus_postcode: 'N/A',
        cus_country: 'N/A',
        cus_phone: order.phone,
        cus_fax: 'N/A',
        ship_name: 'N/A',
        ship_add1: 'N/A',
        ship_add2: 'N/A',
        ship_city: 'N/A',
        ship_state: 'N/A',
        ship_postcode: 'N/A',
        ship_country: 'N/A',
    };
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    const sslResponse = yield sslcz.init(data);
    return sslResponse.GatewayPageURL;
});
const VerifyPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.val_id || payload.status !== 'VALID') {
        if (payload.status === 'FAILED') {
            return `${config_1.default.frontend_base_url}/${config_1.default.payment.fail_url}`;
        }
        if (payload.status === 'CANCELLED') {
            return `${config_1.default.frontend_base_url}/${config_1.default.payment.cancel_url}`;
        }
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid IPN request');
    }
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    const response = yield sslcz.validate({
        val_id: payload.val_id,
    });
    if (response.status !== 'VALID') {
        return `${config_1.default.frontend_base_url}/${config_1.default.payment.fail_url}`;
    }
    yield payment_model_1.Payment.findOneAndUpdate({ transaction_id: response.tran_id }, {
        status: 'PAID',
        payment_gateway_data: response,
    }, { new: true });
    return `${config_1.default.frontend_base_url}/${config_1.default.payment.success_url}`;
});
const PaymentService = { CreatePaymentIntent, VerifyPayment };
exports.default = PaymentService;
