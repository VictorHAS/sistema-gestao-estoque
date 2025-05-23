import { prisma } from '../config/prisma';
export class ProductRepository {
    async create(data) {
        return prisma.product.create({ data });
    }
    async update(id, data) {
        return prisma.product.update({ where: { id }, data });
    }
    async findAll() {
        return prisma.product.findMany();
    }
    async findById(id) {
        return prisma.product.findUnique({ where: { id } });
    }
    async delete(id) {
        return prisma.product.delete({ where: { id } });
    }
}
