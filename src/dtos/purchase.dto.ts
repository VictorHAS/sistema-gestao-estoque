export interface CreatePurchaseDTO {
  supplierId: string;
  userId: string;
  total: number;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}
