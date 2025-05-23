import { prisma } from '../config/prisma';
export class WarehouseRepository {
    async create(data) {
        return prisma.warehouse.create({ data });
    }
    async findAll() {
        return prisma.warehouse.findMany();
    }
    async delete(id) {
        return prisma.warehouse.delete({ where: { id } });
    }
}
