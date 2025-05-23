import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  async login(request: FastifyRequest<{ Body: LoginDTO }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body;
      const token = await this.authService.login(email, password);
      return Response.ok(reply, { token });
    } catch (error) {
      logger.error('Login failed:', error);
      return Response.unauthorized(reply, 'Invalid credentials');
    }
  }

  async profile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user;
      return Response.ok(reply, user);
    } catch (error) {
      logger.error('Profile fetch failed:', error);
      return Response.internalError(reply, 'Failed to fetch profile');
    }
  }
}
