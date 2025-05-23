import { prisma } from '../config/prisma';
export class StockService {
    async create(data) {
        return prisma.stock.create({ data });
    }
    async update(id, data) {
        return prisma.stock.update({ where: { id }, data });
    }
    async findAll() {
        return prisma.stock.findMany({ include: { product: true, warehouse: true } });
    }
}
