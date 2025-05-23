import { UserService } from '../services/user.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';
export class UserController {
    constructor(userService = new UserService()) {
        this.userService = userService;
    }
    async create(request, reply) {
        try {
            const user = await this.userService.create(request.body);
            return Response.created(reply, user);
        }
        catch (error) {
            logger.error('Error creating user:', error);
            return Response.badRequest(reply, 'User creation failed');
        }
    }
    async update(request, reply) {
        try {
            const user = await this.userService.update(request.params.id, request.body);
            return Response.ok(reply, user);
        }
        catch (error) {
            logger.error('Error updating user:', error);
            return Response.badRequest(reply, 'User update failed');
        }
    }
    async findAll(_request, reply) {
        try {
            const users = await this.userService.findAll();
            return Response.ok(reply, users);
        }
        catch (error) {
            logger.error('Error fetching users:', error);
            return Response.internalError(reply, 'Failed to fetch users');
        }
    }
    async findById(request, reply) {
        try {
            const user = await this.userService.findById(request.params.id);
            return user ? Response.ok(reply, user) : Response.notFound(reply, 'User not found');
        }
        catch (error) {
            logger.error('Error finding user:', error);
            return Response.internalError(reply, 'Error fetching user');
        }
    }
    async delete(request, reply) {
        try {
            await this.userService.delete(request.params.id);
            return Response.noContent(reply);
        }
        catch (error) {
            logger.error('Error deleting user:', error);
            return Response.internalError(reply, 'Failed to delete user');
        }
    }
}
