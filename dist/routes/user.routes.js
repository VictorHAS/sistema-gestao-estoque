import { UserController } from '../controllers/user.controller';
export async function userRoutes(app) {
    const controller = new UserController();
    app.post('/users', controller.create.bind(controller));
    app.get('/users', controller.findAll.bind(controller));
    app.get('/users/:id', controller.findById.bind(controller));
    app.put('/users/:id', controller.update.bind(controller));
    app.delete('/users/:id', controller.delete.bind(controller));
}
