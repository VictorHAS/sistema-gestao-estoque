import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../dtos/supplier.dto.js';
import { SupplierService } from '../services/supplier.service.js';
import { Response } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export class SupplierController {
  constructor(private readonly supplierService: SupplierService = new SupplierService()) {}

  async create(request: FastifyRequest<{ Body: CreateSupplierDTO }>, reply: FastifyReply) {
    try {
      const supplier = await this.supplierService.create(request.body);
      return Response.created(reply, supplier);
    } catch (error) {
      logger.error('Error creating supplier:', error);
      return Response.badRequest(reply, 'Failed to create supplier');
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateSupplierDTO }>, reply: FastifyReply) {
    try {
      const supplier = await this.supplierService.update(request.params.id, request.body);
      return Response.ok(reply, supplier);
    } catch (error) {
      logger.error('Error updating supplier:', error);
      return Response.badRequest(reply, 'Failed to update supplier');
    }
  }

  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const suppliers = await this.supplierService.findAll();
      return Response.ok(reply, suppliers);
    } catch (error) {
      logger.error('Error fetching suppliers:', error);
      return Response.internalError(reply, 'Error fetching suppliers');
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await this.supplierService.delete(request.params.id);
      return Response.noContent(reply);
    } catch (error) {
      logger.error('Error deleting supplier:', error);
      return Response.internalError(reply, 'Failed to delete supplier');
    }
  }
}
