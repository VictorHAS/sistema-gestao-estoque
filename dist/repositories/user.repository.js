import { prisma } from '../config/prisma';
export class UserRepository {
    async create(data) {
        return prisma.user.create({ data });
    }
    async update(id, data) {
        return prisma.user.update({ where: { id }, data });
    }
    async findAll() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
    async delete(id) {
        return prisma.user.delete({ where: { id } });
    }
}
