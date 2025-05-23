import { WarehouseService } from '../services/warehouse.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';
export class WarehouseController {
    constructor(warehouseService = new WarehouseService()) {
        this.warehouseService = warehouseService;
    }
    async create(request, reply) {
        try {
            const warehouse = await this.warehouseService.create(request.body);
            return Response.created(reply, warehouse);
        }
        catch (error) {
            logger.error('Error creating warehouse:', error);
            return Response.badRequest(reply, 'Failed to create warehouse');
        }
    }
    async findAll(_request, reply) {
        try {
            const warehouses = await this.warehouseService.findAll();
            return Response.ok(reply, warehouses);
        }
        catch (error) {
            logger.error('Error fetching warehouses:', error);
            return Response.internalError(reply, 'Error fetching warehouses');
        }
    }
    async delete(request, reply) {
        try {
            await this.warehouseService.delete(request.params.id);
            return Response.noContent(reply);
        }
        catch (error) {
            logger.error('Error deleting warehouse:', error);
            return Response.internalError(reply, 'Failed to delete warehouse');
        }
    }
}
