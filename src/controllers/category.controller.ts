import { FastifyRequest, FastifyReply } from 'fastify';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos/category.dto';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService = new CategoryService()) {}

  async create(request: FastifyRequest<{ Body: CreateCategoryDTO }>, reply: FastifyReply) {
    try {
      const category = await this.categoryService.create(request.body);
      return Response.created(reply, category);
    } catch (error) {
      logger.error('Error creating category:', error);
      return Response.badRequest(reply, 'Failed to create category');
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateCategoryDTO }>, reply: FastifyReply) {
    try {
      const category = await this.categoryService.update(request.params.id, request.body);
      return Response.ok(reply, category);
    } catch (error) {
      logger.error('Error updating category:', error);
      return Response.badRequest(reply, 'Failed to update category');
    }
  }

  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const categories = await this.categoryService.findAll();
      return Response.ok(reply, categories);
    } catch (error) {
      logger.error('Error fetching categories:', error);
      return Response.internalError(reply, 'Error fetching categories');
    }
  }

  async findById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const category = await this.categoryService.findById(request.params.id);
      return category ? Response.ok(reply, category) : Response.notFound(reply, 'Category not found');
    } catch (error) {
      logger.error('Error fetching category:', error);
      return Response.internalError(reply, 'Error fetching category');
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await this.categoryService.delete(request.params.id);
      return Response.noContent(reply);
    } catch (error) {
      logger.error('Error deleting category:', error);
      return Response.internalError(reply, 'Failed to delete category');
    }
  }
}
