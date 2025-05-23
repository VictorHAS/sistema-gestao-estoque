import { AuthService } from '../services/auth.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';
export class AuthController {
    constructor(authService = new AuthService()) {
        this.authService = authService;
    }
    async login(request, reply) {
        try {
            const { email, password } = request.body;
            const token = await this.authService.login(email, password);
            return Response.ok(reply, { token });
        }
        catch (error) {
            logger.error('Login failed:', error);
            return Response.unauthorized(reply, 'Invalid credentials');
        }
    }
    async profile(request, reply) {
        try {
            const user = request.user;
            return Response.ok(reply, user);
        }
        catch (error) {
            logger.error('Profile fetch failed:', error);
            return Response.internalError(reply, 'Failed to fetch profile');
        }
    }
}
