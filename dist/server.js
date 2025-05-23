import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { environment } from './config/environment';
import { authenticate } from './middlewares/authenticate';
// Rotas
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { productRoutes } from './routes/product.routes';
import { supplierRoutes } from './routes/supplier.routes';
import { warehouseRoutes } from './routes/warehouse.routes';
import { stockRoutes } from './routes/stock.routes';
import { purchaseRoutes } from './routes/purchase.routes';
import { saleRoutes } from './routes/sale.routes';
import { categoryRoutes } from './routes/category.routes';
dotenv.config();
async function buildServer() {
    const app = Fastify({ logger: true });
    // Middleware global
    app.register(cors);
    // JWT middleware decorator
    app.decorate('authenticate', authenticate);
    // Registro das rotas
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
        console.log(`🚀 Server running on http://localhost:${environment.port}`);
    });
});
export { buildServer };
