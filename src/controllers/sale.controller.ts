import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateSaleDTO } from '../dtos/sale.dto';
import { SaleService } from '../services/sale.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';

export class SaleController {
  constructor(private readonly saleService: SaleService = new SaleService()) {}

  async create(request: FastifyRequest<{ Body: CreateSaleDTO }>, reply: FastifyReply) {
    try {
      const sale = await this.saleService.create(request.body);
      return Response.created(reply, sale);
    } catch (error) {
      logger.error('Error creating sale:', error);
      return Response.badRequest(reply, 'Failed to create sale');
    }
  }

  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const sales = await this.saleService.findAll();
      return Response.ok(reply, sales);
    } catch (error) {
      logger.error('Error fetching sales:', error);
      return Response.internalError(reply, 'Error fetching sales');
    }
  }
}
