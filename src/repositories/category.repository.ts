import { prisma } from '../config/prisma';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos/category.dto';

export class CategoryRepository {
  async create(data: CreateCategoryDTO) {
    return prisma.category.create({ data });
  }

  async update(id: string, data: UpdateCategoryDTO) {
    return prisma.category.update({ where: { id }, data });
  }

  async findAll() {
    return prisma.category.findMany();
  }

  async findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}
