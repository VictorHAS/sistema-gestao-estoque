export type UserRole = "ADMIN" | "GERENTE" | "FUNCIONARIO"

export type Permission =
  // Usuarios
  | "usuarios:read" | "usuarios:create" | "usuarios:update" | "usuarios:delete" | "usuarios:update_password"
  // Produtos
  | "produtos:read" | "produtos:create" | "produtos:update" | "produtos:delete"
  // Categorias
  | "categorias:read" | "categorias:create" | "categorias:update" | "categorias:delete"
  // Fornecedores
  | "fornecedores:read" | "fornecedores:create" | "fornecedores:update" | "fornecedores:delete"
  | "fornecedores:manage_products"
  // Estoque
  | "estoque:read" | "estoque:create" | "estoque:update" | "estoque:manage"
  // Depositos
  | "depositos:read" | "depositos:create" | "depositos:update" | "depositos:delete"
  // Compras
  | "compras:read" | "compras:create" | "compras:update_status" | "compras:delete"
  // Vendas
  | "vendas:read" | "vendas:create" | "vendas:update_status" | "vendas:delete"
  // Dashboard & Reports
  | "dashboard:view" | "relatorios:view"

// Permission mapping based on backend routes
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    // All permissions for ADMIN
    "usuarios:read", "usuarios:create", "usuarios:update", "usuarios:delete", "usuarios:update_password",
    "produtos:read", "produtos:create", "produtos:update", "produtos:delete",
    "categorias:read", "categorias:create", "categorias:update", "categorias:delete",
    "fornecedores:read", "fornecedores:create", "fornecedores:update", "fornecedores:delete", "fornecedores:manage_products",
    "estoque:read", "estoque:create", "estoque:update", "estoque:manage",
    "depositos:read", "depositos:create", "depositos:update", "depositos:delete",
    "compras:read", "compras:create", "compras:update_status", "compras:delete",
    "vendas:read", "vendas:create", "vendas:update_status", "vendas:delete",
    "dashboard:view", "relatorios:view"
  ],
  GERENTE: [
    // GERENTE has most permissions except user management and some deletions
    "usuarios:read", // Can list users but not create/delete
    "produtos:read", "produtos:create", "produtos:update", // Cannot delete products
    "categorias:read", "categorias:create", "categorias:update", // Cannot delete categories
    "fornecedores:read", "fornecedores:create", "fornecedores:update", "fornecedores:manage_products", // Cannot delete suppliers
    "estoque:read", "estoque:create", "estoque:update", "estoque:manage",
    "depositos:read", "depositos:create", "depositos:update", // Cannot delete deposits
    "compras:read", "compras:create", "compras:update_status", // Cannot delete purchases
    "vendas:read", "vendas:create", "vendas:update_status", // Cannot delete sales
    "dashboard:view", "relatorios:view"
  ],
  FUNCIONARIO: [
    // FUNCIONARIO has read access and basic operations
    "usuarios:update_password", // Can only update own password
    "produtos:read",
    "categorias:read",
    "fornecedores:read",
    "estoque:read", "estoque:manage", // Can manage stock but not create/update stock records
    "depositos:read",
    "compras:read", "compras:create", // Can create purchases
    "vendas:read", "vendas:create", // Can create sales
    "dashboard:view"
  ]
}

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(permission)
}

export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}

export function getUserPermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || []
}

// Helper functions for specific features
export const can = {
  // Users
  manageUsers: (role: UserRole) => hasPermission(role, "usuarios:create"),
  viewUsers: (role: UserRole) => hasPermission(role, "usuarios:read"),
  deleteUsers: (role: UserRole) => hasPermission(role, "usuarios:delete"),

  // Products
  createProducts: (role: UserRole) => hasPermission(role, "produtos:create"),
  editProducts: (role: UserRole) => hasPermission(role, "produtos:update"),
  deleteProducts: (role: UserRole) => hasPermission(role, "produtos:delete"),

  // Categories
  manageCategories: (role: UserRole) => hasAnyPermission(role, ["categorias:create", "categorias:update"]),
  deleteCategories: (role: UserRole) => hasPermission(role, "categorias:delete"),

  // Suppliers
  manageSuppliers: (role: UserRole) => hasAnyPermission(role, ["fornecedores:create", "fornecedores:update"]),
  deleteSuppliers: (role: UserRole) => hasPermission(role, "fornecedores:delete"),
  manageSupplierProducts: (role: UserRole) => hasPermission(role, "fornecedores:manage_products"),

  // Stock
  manageStock: (role: UserRole) => hasAnyPermission(role, ["estoque:create", "estoque:update"]),
  adjustStock: (role: UserRole) => hasPermission(role, "estoque:manage"),

  // Warehouses
  manageWarehouses: (role: UserRole) => hasAnyPermission(role, ["depositos:create", "depositos:update"]),
  deleteWarehouses: (role: UserRole) => hasPermission(role, "depositos:delete"),

  // Purchases
  createPurchases: (role: UserRole) => hasPermission(role, "compras:create"),
  updatePurchaseStatus: (role: UserRole) => hasPermission(role, "compras:update_status"),
  deletePurchases: (role: UserRole) => hasPermission(role, "compras:delete"),

  // Sales
  createSales: (role: UserRole) => hasPermission(role, "vendas:create"),
  updateSaleStatus: (role: UserRole) => hasPermission(role, "vendas:update_status"),
  deleteSales: (role: UserRole) => hasPermission(role, "vendas:delete"),

  // Reports
  viewReports: (role: UserRole) => hasPermission(role, "relatorios:view"),
}
