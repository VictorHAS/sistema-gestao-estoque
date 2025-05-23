import { SupplierService } from '../services/supplier.service';
import { Response } from '../utils/response';
import { logger } from '../utils/logger';
export class SupplierController {
    constructor(supplierService = new SupplierService()) {
        this.supplierService = supplierService;
    }
    async create(request, reply) {
        try {
            const supplier = await this.supplierService.create(request.body);
            return Response.created(reply, supplier);
        }
        catch (error) {
            logger.error('Error creating supplier:', error);
            return Response.badRequest(reply, 'Failed to create supplier');
        }
    }
    async update(request, reply) {
        try {
            const supplier = await this.supplierService.update(request.params.id, request.body);
            return Response.ok(reply, supplier);
        }
        catch (error) {
            logger.error('Error updating supplier:', error);
            return Response.badRequest(reply, 'Failed to update supplier');
        }
    }
    async findAll(_request, reply) {
        try {
            const suppliers = await this.supplierService.findAll();
            return Response.ok(reply, suppliers);
        }
        catch (error) {
            logger.error('Error fetching suppliers:', error);
            return Response.internalError(reply, 'Error fetching suppliers');
        }
    }
    async delete(request, reply) {
        try {
            await this.supplierService.delete(request.params.id);
            return Response.noContent(reply);
        }
        catch (error) {
            logger.error('Error deleting supplier:', error);
            return Response.internalError(reply, 'Failed to delete supplier');
        }
    }
}
