export interface CreateSupplierDTO {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}
