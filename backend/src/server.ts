import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

import { environment } from './config/environment.js';
import { authenticate } from './middlewares/authenticate.js';
import { registerSwagger } from './utils/swagger.js';

import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { productRoutes } from './routes/product.routes.js';
import { supplierRoutes } from './routes/supplier.routes.js';
import { warehouseRoutes } from './routes/warehouse.routes.js';
import { stockRoutes } from './routes/stock.routes.js';
import { purchaseRoutes } from './routes/purchase.routes.js';
import { saleRoutes } from './routes/sale.routes.js';
import { categoryRoutes } from './routes/category.routes.js';


dotenv.config();

export async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors);

  app.decorate('authenticate', authenticate);

  await registerSwagger(app);

  app.register(authRoutes);
  app.register(userRoutes);
  app.register(productRoutes);
  app.register(supplierRoutes);
  app.register(categoryRoutes);
  app.register(warehouseRoutes);
  app.register(stockRoutes);
  app.register(purchaseRoutes);
  app.register(saleRoutes);

  return app;
}

buildServer().then(app => {
  app.listen({ port: environment.port, host: '0.0.0.0' }, err => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`🚀 Server running at http://localhost:${environment.port}`);
    console.log(`📚 Swagger docs at http://localhost:${environment.port}/docs`);
  });
});
