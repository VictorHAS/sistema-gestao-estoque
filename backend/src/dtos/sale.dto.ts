export interface CreateSaleDTO {
  userId: string;
  total: number;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}
