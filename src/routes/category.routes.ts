import { FastifyInstance } from 'fastify';
import { CategoryController } from '../controllers/category.controller.js';

export async function categoryRoutes(app: FastifyInstance) {
  const controller = new CategoryController();

  app.post('/categories', controller.create.bind(controller));
  app.get('/categories', controller.findAll.bind(controller));
  app.get('/categories/:id', controller.findById.bind(controller));
  app.put('/categories/:id', controller.update.bind(controller));
  app.delete('/categories/:id', controller.delete.bind(controller));
}
