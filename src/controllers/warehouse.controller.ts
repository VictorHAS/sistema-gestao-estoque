import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateWarehouseDTO, UpdateWarehouseDTO } from '../dtos/warehouse.dto';
import { WarehouseService } from '../services/warehouse.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';

export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService = new WarehouseService()) {}

  async create(request: FastifyRequest<{ Body: CreateWarehouseDTO }>, reply: FastifyReply) {
    try {
      const warehouse = await this.warehouseService.create(request.body);
      return Response.created(reply, warehouse);
    } catch (error) {
      logger.error('Error creating warehouse:', error);
      return Response.badRequest(reply, 'Failed to create warehouse');
    }
  }

  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const warehouses = await this.warehouseService.findAll();
      return Response.ok(reply, warehouses);
    } catch (error) {
      logger.error('Error fetching warehouses:', error);
      return Response.internalError(reply, 'Error fetching warehouses');
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await this.warehouseService.delete(request.params.id);
      return Response.noContent(reply);
    } catch (error) {
      logger.error('Error deleting warehouse:', error);
      return Response.internalError(reply, 'Failed to delete warehouse');
    }
  }
}
