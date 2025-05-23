import { StockController } from '../controllers/stock.controller';
export async function stockRoutes(app) {
    const controller = new StockController();
    app.post('/stock', controller.create.bind(controller));
    app.get('/stock', controller.findAll.bind(controller));
    app.put('/stock/:id', controller.update.bind(controller));
}
