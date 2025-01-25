"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_routes_1 = require("../modules/products/products.routes");
const orders_routes_1 = require("../modules/orders/orders.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const user_routes_1 = require("../modules/user/user.routes");
const router = express_1.default.Router();
const routes = [
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: '/products',
        route: products_routes_1.ProductsRoutes,
    },
    {
        path: '/orders',
        route: orders_routes_1.OrdersRoutes,
    },
    {
        path: '/payment',
        route: payment_routes_1.PaymentRoutes,
    },
    {
        path: '/users',
        route: user_routes_1.UserRoutes,
    },
];
routes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
