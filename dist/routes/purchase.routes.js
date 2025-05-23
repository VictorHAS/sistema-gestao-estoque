import { PurchaseController } from '../controllers/purchase.controller';
export async function purchaseRoutes(app) {
    const controller = new PurchaseController();
    app.post('/purchases', controller.create.bind(controller));
    app.get('/purchases', controller.findAll.bind(controller));
}
