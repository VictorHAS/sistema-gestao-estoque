import { prisma } from '../config/prisma';
import { CreatePurchaseDTO } from '../dtos/purchase.dto';

export class PurchaseRepository {
  async create(data: CreatePurchaseDTO) {
    const { items, ...purchase } = data;
    return prisma.purchase.create({
      data: {
        ...purchase,
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
    return prisma.purchase.findMany({ include: { items: true } });
  }
}
