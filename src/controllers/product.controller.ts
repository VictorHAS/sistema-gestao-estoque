import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/product.dto';
import { ProductService } from '../services/product.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';

export class ProductController {
  constructor(private readonly productService: ProductService = new ProductService()) {}

  async create(request: FastifyRequest<{ Body: CreateProductDTO }>, reply: FastifyReply) {
    try {
      const product = await this.productService.create(request.body);
      return Response.created(reply, product);
    } catch (error) {
      logger.error('Error creating product:', error);
      return Response.badRequest(reply, 'Failed to create product');
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateProductDTO }>, reply: FastifyReply) {
    try {
      const product = await this.productService.update(request.params.id, request.body);
      return Response.ok(reply, product);
    } catch (error) {
      logger.error('Error updating product:', error);
      return Response.badRequest(reply, 'Failed to update product');
    }
  }

  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await this.productService.findAll();
      return Response.ok(reply, products);
    } catch (error) {
      logger.error('Error fetching products:', error);
      return Response.internalError(reply, 'Error fetching products');
    }
  }

  async findById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const product = await this.productService.findById(request.params.id);
      return product ? Response.ok(reply, product) : Response.notFound(reply, 'Product not found');
    } catch (error) {
      logger.error('Error fetching product:', error);
      return Response.internalError(reply, 'Error fetching product');
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await this.productService.delete(request.params.id);
      return Response.noContent(reply);
    } catch (error) {
      logger.error('Error deleting product:', error);
      return Response.internalError(reply, 'Failed to delete product');
    }
  }
}
