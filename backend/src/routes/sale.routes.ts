import { FastifyInstance } from 'fastify';
import { SaleController } from '../controllers/sale.controller.js';

export async function saleRoutes(app: FastifyInstance) {
  const controller = new SaleController();

  app.post('/sales', controller.create.bind(controller));
  app.get('/sales', controller.findAll.bind(controller));
}
