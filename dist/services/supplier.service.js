import { prisma } from '../config/prisma';
export class SupplierService {
    async create(data) {
        return prisma.supplier.create({ data });
    }
    async update(id, data) {
        return prisma.supplier.update({ where: { id }, data });
    }
    async findAll() {
        return prisma.supplier.findMany();
    }
    async findById(id) {
        return prisma.supplier.findUnique({ where: { id } });
    }
    async delete(id) {
        return prisma.supplier.delete({ where: { id } });
    }
}
