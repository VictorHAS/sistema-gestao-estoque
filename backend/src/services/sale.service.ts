import { prisma } from '../config/prisma';
import { CreateSaleDTO } from '../dtos/sale.dto.js';

export class SaleService {
  async create(data: CreateSaleDTO) {
    const { items, ...saleData } = data;

    return prisma.sale.create({
      data: {
        ...saleData,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        }
      },
      include: { items: true }
    });
  }

  async findAll() {
    return prisma.sale.findMany({ include: { items: true } });
  }
}
