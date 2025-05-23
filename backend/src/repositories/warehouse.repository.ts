import { prisma } from '../config/prisma';
import { CreateWarehouseDTO } from '../dtos/warehouse.dto';

export class WarehouseRepository {
  async create(data: CreateWarehouseDTO) {
    return prisma.warehouse.create({ data });
  }

  async findAll() {
    return prisma.warehouse.findMany();
  }

  async delete(id: string) {
    return prisma.warehouse.delete({ where: { id } });
  }
}
