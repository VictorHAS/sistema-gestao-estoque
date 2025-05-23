import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateStockDTO, UpdateStockDTO } from '../dtos/stock.dto';
import { StockService } from '../services/stock.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';

export class StockController {
  constructor(private readonly stockService: StockService = new StockService()) {}

  async create(request: FastifyRequest<{ Body: CreateStockDTO }>, reply: FastifyReply) {
    try {
      const stock = await this.stockService.create(request.body);
      return Response.created(reply, stock);
    } catch (error) {
      logger.error('Error creating stock:', error);
      return Response.badRequest(reply, 'Failed to create stock');
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateStockDTO }>, reply: FastifyReply) {
    try {
      const stock = await this.stockService.update(request.params.id, request.body);
      return Response.ok(reply, stock);
    } catch (error) {
      logger.error('Error updating stock:', error);
      return Response.badRequest(reply, 'Failed to update stock');
    }
  }

  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const stocks = await this.stockService.findAll();
      return Response.ok(reply, stocks);
    } catch (error) {
      logger.error('Error fetching stock:', error);
      return Response.internalError(reply, 'Error fetching stock');
    }
  }
}
