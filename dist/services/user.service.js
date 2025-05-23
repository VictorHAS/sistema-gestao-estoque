import { prisma } from '../config/prisma';
import { hash } from 'bcryptjs';
export class UserService {
    async create(data) {
        const hashedPassword = await hash(data.password, 10);
        return prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.password) {
            updateData.password = await hash(data.password, 10);
        }
        return prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
    async findAll() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
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
                createdAt: true,
            },
        });
    }
    async delete(id) {
        return prisma.user.delete({ where: { id } });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
}
