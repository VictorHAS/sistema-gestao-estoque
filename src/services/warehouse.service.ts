import { prisma } from '../config/prisma';
import { CreateWarehouseDTO, UpdateWarehouseDTO } from '../dtos/warehouse.dto';

export class WarehouseService {
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
