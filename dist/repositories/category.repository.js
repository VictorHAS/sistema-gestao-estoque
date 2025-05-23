import { prisma } from '../config/prisma';
export class CategoryRepository {
    async create(data) {
        return prisma.category.create({ data });
    }
    async update(id, data) {
        return prisma.category.update({ where: { id }, data });
    }
    async findAll() {
        return prisma.category.findMany();
    }
    async findById(id) {
        return prisma.category.findUnique({ where: { id } });
    }
    async delete(id) {
        return prisma.category.delete({ where: { id } });
    }
}
