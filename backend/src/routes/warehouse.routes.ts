import { FastifyInstance } from 'fastify';
import { WarehouseController } from '../controllers/warehouse.controller.js';

export async function warehouseRoutes(app: FastifyInstance) {
  const controller = new WarehouseController();

  app.post('/warehouses', controller.create.bind(controller));
  app.get('/warehouses', controller.findAll.bind(controller));
  app.delete('/warehouses/:id', controller.delete.bind(controller));
}
