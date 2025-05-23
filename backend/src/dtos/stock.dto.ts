export interface CreateStockDTO {
  productId: string;
  warehouseId: string;
  quantity: number;
}

export interface UpdateStockDTO {
  quantity: number;
}
