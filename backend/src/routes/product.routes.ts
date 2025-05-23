import { FastifyInstance } from 'fastify';
import { ProductController } from '../controllers/product.controller.js';

export async function productRoutes(app: FastifyInstance) {
  const controller = new ProductController();

  app.post('/products', controller.create.bind(controller));
  app.get('/products', controller.findAll.bind(controller));
  app.get('/products/:id', controller.findById.bind(controller));
  app.put('/products/:id', controller.update.bind(controller));
  app.delete('/products/:id', controller.delete.bind(controller));
}
