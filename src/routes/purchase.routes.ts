import { FastifyInstance } from 'fastify';
import { PurchaseController } from '../controllers/purchase.controller.js';

export async function purchaseRoutes(app: FastifyInstance) {
  const controller = new PurchaseController();

  app.post('/purchases', controller.create.bind(controller));
  app.get('/purchases', controller.findAll.bind(controller));
}
