import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller.js';

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();

  app.post('/auth/login', controller.login.bind(controller));
  app.get('/auth/profile', { preValidation: [app.authenticate] }, controller.profile.bind(controller));
}
