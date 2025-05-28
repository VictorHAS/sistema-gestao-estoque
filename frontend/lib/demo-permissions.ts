import { can, getUserPermissions, type UserRole } from './permissions'

export function demonstratePermissions() {
  const roles: UserRole[] = ['ADMIN', 'GERENTE', 'FUNCIONARIO']

  console.group('🔐 Sistema de Permissões - Demonstração')

  roles.forEach(role => {
    console.group(`👤 ${role}`)

    // Get all permissions for this role
    const permissions = getUserPermissions(role)
    console.log(`📋 Total de permissões: ${permissions.length}`)

    // Show key capabilities
    console.log(`📝 Gerenciar Produtos: ${can.createProducts(role) ? '✅' : '❌'}`)
    console.log(`👥 Gerenciar Usuários: ${can.manageUsers(role) ? '✅' : '❌'}`)
    console.log(`📊 Ver Relatórios: ${can.viewReports(role) ? '✅' : '❌'}`)
    console.log(`🗑️ Excluir Dados: ${can.deleteProducts(role) || can.deleteUsers(role) ? '✅' : '❌'}`)
    console.log(`📦 Gerenciar Estoque: ${can.adjustStock(role) ? '✅' : '❌'}`)

    if (role === 'ADMIN') {
      console.log('🛡️ ADMIN tem acesso total ao sistema')
    } else if (role === 'GERENTE') {
      console.log('⚖️ GERENTE pode gerenciar a maioria das operações, mas não usuários')
    } else {
      console.log('👨‍💼 FUNCIONARIO tem acesso limitado, focado em operações básicas')
    }

    console.groupEnd()
  })

  console.groupEnd()
}

// Usage examples for different scenarios
export const permissionExamples = {
  // Products management
  productActions: {
    create: (role: UserRole) => can.createProducts(role),
    edit: (role: UserRole) => can.editProducts(role),
    delete: (role: UserRole) => can.deleteProducts(role),
    view: () => true, // Everyone can view products
  },

  // User management
  userActions: {
    create: (role: UserRole) => can.manageUsers(role),
    edit: (role: UserRole) => can.manageUsers(role),
    delete: (role: UserRole) => can.deleteUsers(role),
    view: (role: UserRole) => can.viewUsers(role),
  },

  // Stock management
  stockActions: {
    adjust: (role: UserRole) => can.adjustStock(role),
    create: (role: UserRole) => can.manageStock(role),
    view: () => true, // Everyone can view stock
  },

  // Reports
  reportActions: {
    view: (role: UserRole) => can.viewReports(role),
    export: (role: UserRole) => can.viewReports(role), // Same as view for now
  }
}
