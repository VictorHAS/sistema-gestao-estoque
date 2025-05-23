import { FastifyRequest, FastifyReply } from 'fastify';
import { CreatePurchaseDTO } from '../dtos/purchase.dto';
import { PurchaseService } from '../services/purchase.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';

export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService = new PurchaseService()) {}

  async create(request: FastifyRequest<{ Body: CreatePurchaseDTO }>, reply: FastifyReply) {
    try {
      const purchase = await this.purchaseService.create(request.body);
      return Response.created(reply, purchase);
    } catch (error) {
      logger.error('Error creating purchase:', error);
      return Response.badRequest(reply, 'Failed to create purchase');
    }
  }

  async findAll(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const purchases = await this.purchaseService.findAll();
      return Response.ok(reply, purchases);
    } catch (error) {
      logger.error('Error fetching purchases:', error);
      return Response.internalError(reply, 'Error fetching purchases');
    }
  }
}
