import { useAuth } from "@/lib/auth"
import { hasPermission, hasAnyPermission, getUserPermissions, can, type Permission, type UserRole } from "@/lib/permissions"

export function usePermissions() {
  const { user } = useAuth()

  const userRole = user?.cargo as UserRole

  return {
    hasPermission: (permission: Permission) => {
      if (!userRole) return false
      return hasPermission(userRole, permission)
    },

    hasAnyPermission: (permissions: Permission[]) => {
      if (!userRole) return false
      return hasAnyPermission(userRole, permissions)
    },

    getUserPermissions: () => {
      if (!userRole) return []
      return getUserPermissions(userRole)
    },

    can: {
      // Users
      manageUsers: can.manageUsers(userRole),
      viewUsers: can.viewUsers(userRole),
      deleteUsers: can.deleteUsers(userRole),

      // Products
      createProducts: can.createProducts(userRole),
      editProducts: can.editProducts(userRole),
      deleteProducts: can.deleteProducts(userRole),

      // Categories
      manageCategories: can.manageCategories(userRole),
      deleteCategories: can.deleteCategories(userRole),

      // Suppliers
      manageSuppliers: can.manageSuppliers(userRole),
      deleteSuppliers: can.deleteSuppliers(userRole),
      manageSupplierProducts: can.manageSupplierProducts(userRole),

      // Stock
      manageStock: can.manageStock(userRole),
      adjustStock: can.adjustStock(userRole),

      // Warehouses
      manageWarehouses: can.manageWarehouses(userRole),
      deleteWarehouses: can.deleteWarehouses(userRole),

      // Purchases
      createPurchases: can.createPurchases(userRole),
      updatePurchaseStatus: can.updatePurchaseStatus(userRole),
      deletePurchases: can.deletePurchases(userRole),

      // Sales
      createSales: can.createSales(userRole),
      updateSaleStatus: can.updateSaleStatus(userRole),
      deleteSales: can.deleteSales(userRole),

      // Reports
      viewReports: can.viewReports(userRole),
    },

    // Role information
    role: userRole,
    isAdmin: userRole === "ADMIN",
    isManager: userRole === "GERENTE",
    isEmployee: userRole === "FUNCIONARIO",
  }
}
