import { FastifyInstance } from 'fastify';
import { SupplierController } from '../controllers/supplier.controller';

export async function supplierRoutes(app: FastifyInstance) {
  const controller = new SupplierController();

  app.post('/suppliers', controller.create.bind(controller));
  app.get('/suppliers', controller.findAll.bind(controller));
  app.put('/suppliers/:id', controller.update.bind(controller));
  app.delete('/suppliers/:id', controller.delete.bind(controller));
}
