import { prisma } from '../config/prisma';
import { CreateSaleDTO } from '../dtos/sale.dto';

export class SaleRepository {
  async create(data: CreateSaleDTO) {
    const { items, ...sale } = data;
    return prisma.sale.create({
      data: {
        ...sale,
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
