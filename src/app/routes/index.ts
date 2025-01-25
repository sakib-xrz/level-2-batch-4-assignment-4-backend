import express from 'express';
import { ProductsRoutes } from '../modules/products/products.routes';
import { OrdersRoutes } from '../modules/orders/orders.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';

const router = express.Router();

type Route = {
  path: string;
  route: express.Router;
};

const routes: Route[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/products',
    route: ProductsRoutes,
  },
  {
    path: '/orders',
    route: OrdersRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
