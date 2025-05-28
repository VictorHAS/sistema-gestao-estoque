"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Warehouse,
  Tags,
  FileText,
  Settings,
  Home,
  Building2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { usePermissions } from "@/hooks/use-permissions"
import { Permission } from "@/lib/permissions"

interface MenuItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  permission?: Permission
  adminOnly?: boolean
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    permission: "dashboard:view",
  },
  {
    title: "Produtos",
    url: "/dashboard/produtos",
    icon: Package,
    permission: "produtos:read",
  },
  {
    title: "Categorias",
    url: "/dashboard/categorias",
    icon: Tags,
    permission: "categorias:read",
  },
  {
    title: "Fornecedores",
    url: "/dashboard/fornecedores",
    icon: Users,
    permission: "fornecedores:read",
  },
  {
    title: "Estoque",
    url: "/dashboard/estoque",
    icon: Warehouse,
    permission: "estoque:read",
  },
  {
    title: "Depósitos",
    url: "/dashboard/depositos",
    icon: Building2,
    permission: "depositos:read",
  },
  {
    title: "Compras",
    url: "/dashboard/compras",
    icon: ShoppingCart,
    permission: "compras:read",
  },
  {
    title: "Vendas",
    url: "/dashboard/vendas",
    icon: TrendingUp,
    permission: "vendas:read",
  },
  {
    title: "Relatórios",
    url: "/dashboard/relatorios",
    icon: FileText,
    permission: "relatorios:view",
  },
  {
    title: "Usuários",
    url: "/dashboard/usuarios",
    icon: Users,
    permission: "usuarios:read",
  },
  {
    title: "Configurações",
    url: "/dashboard/configuracoes",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { hasPermission, isAdmin } = usePermissions()

  const filteredMenuItems = menuItems.filter(item => {
    // If no permission is required, show the item
    if (!item.permission && !item.adminOnly) return true

    // If admin only, check if user is admin
    if (item.adminOnly && !isAdmin) return false

    // Check permission
    if (item.permission && !hasPermission(item.permission)) return false

    return true
  })

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Sistema Estoque</span>
                  <span className="truncate text-xs">Gestão Completa</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/configuracoes">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
