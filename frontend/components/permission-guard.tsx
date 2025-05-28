"use client"

import { usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/lib/permissions"

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
  role?: "ADMIN" | "GERENTE" | "FUNCIONARIO"
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  role
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, role: userRole } = usePermissions()

  // Check role-based access
  if (role && userRole !== role) {
    return <>{fallback}</>
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? permissions.every(p => hasPermission(p))
      : hasAnyPermission(permissions)

    if (!hasAccess) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}
