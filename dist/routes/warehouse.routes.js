import { WarehouseController } from '../controllers/warehouse.controller';
export async function warehouseRoutes(app) {
    const controller = new WarehouseController();
    app.post('/warehouses', controller.create.bind(controller));
    app.get('/warehouses', controller.findAll.bind(controller));
    app.delete('/warehouses/:id', controller.delete.bind(controller));
}
