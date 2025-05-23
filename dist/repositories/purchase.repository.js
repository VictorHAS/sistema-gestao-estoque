import { prisma } from '../config/prisma';
export class PurchaseRepository {
    async create(data) {
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
