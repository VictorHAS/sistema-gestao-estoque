import { prisma } from '../config/prisma';
import { CreateSupplierDTO, UpdateSupplierDTO } from '../dtos/supplier.dto';

export class SupplierRepository {
  async create(data: CreateSupplierDTO) {
    return prisma.supplier.create({ data });
  }

  async update(id: string, data: UpdateSupplierDTO) {
    return prisma.supplier.update({ where: { id }, data });
  }

  async findAll() {
    return prisma.supplier.findMany();
  }

  async findById(id: string) {
    return prisma.supplier.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return prisma.supplier.delete({ where: { id } });
  }
}
