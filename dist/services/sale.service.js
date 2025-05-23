import { prisma } from '../config/prisma';
export class SaleService {
    async create(data) {
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
