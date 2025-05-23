import { prisma } from '../config/prisma';
import { CreatePurchaseDTO } from '../dtos/purchase.dto.js';

export class PurchaseService {
  async create(data: CreatePurchaseDTO) {
    const { items, ...purchaseData } = data;

    return prisma.purchase.create({
      data: {
        ...purchaseData,
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
