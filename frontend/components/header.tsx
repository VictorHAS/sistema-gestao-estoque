"use client"

import { Moon, Sun, User, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"

export function Header() {
  const { setTheme, theme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getCargoColor = (cargo: string) => {
    switch (cargo) {
      case "ADMIN":
        return "bg-destructive"
      case "GERENTE":
        return "bg-primary"
      case "FUNCIONARIO":
        return "bg-success"
      default:
        return "bg-muted-foreground"
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Sistema de Gestão de Estoque</h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <User className="h-4 w-4" />
              <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getCargoColor(user?.cargo || "")}`}></div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.nome}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <Badge variant="outline" className="w-fit text-xs">
                  {user?.cargo}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
