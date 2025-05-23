import { SaleController } from '../controllers/sale.controller';
export async function saleRoutes(app) {
    const controller = new SaleController();
    app.post('/sales', controller.create.bind(controller));
    app.get('/sales', controller.findAll.bind(controller));
}
