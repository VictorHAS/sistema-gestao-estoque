import { AuthController } from '../controllers/auth.controller';
export async function authRoutes(app) {
    const controller = new AuthController();
    app.post('/auth/login', controller.login.bind(controller));
    app.get('/auth/profile', { preValidation: [app.authenticate] }, controller.profile.bind(controller));
}
