import { prisma } from '../config/prisma';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';

export class UserRepository {
  async create(data: any) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: any) {
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

  async findById(id: string) {
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

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
