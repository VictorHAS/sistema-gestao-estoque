import { prisma } from '../config/prisma';
import { CreateStockDTO, UpdateStockDTO } from '../dtos/stock.dto';

export class StockService {
  async create(data: CreateStockDTO) {
    return prisma.stock.create({ data });
  }

  async update(id: string, data: UpdateStockDTO) {
    return prisma.stock.update({ where: { id }, data });
  }

  async findAll() {
    return prisma.stock.findMany({ include: { product: true, warehouse: true } });
  }
}
