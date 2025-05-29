"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building, Mail, Phone, MapPin, Package, Calendar, Activity } from "lucide-react"

interface Supplier {
  id: string
  nome: string
  email: string
  telefone: string
  endereco: string
  produtosAtivos: number
  ultimaCompra: string
  status: string
}

interface SupplierDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
}

export function SupplierDetailsDialog({ open, onOpenChange, supplier }: SupplierDetailsDialogProps) {
  if (!supplier) return null

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "default" : "secondary"
  }

  const isRecentPurchase = () => {
    const lastPurchase = new Date(supplier.ultimaCompra)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return lastPurchase > threeMonthsAgo
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Detalhes do Fornecedor
          </DialogTitle>
          <DialogDescription>
            Informações completas do fornecedor selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Nome:</span>
                <span>{supplier.nome}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Telefone:</span>
                <span>{supplier.telefone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Endereço:</span>
                <span>{supplier.endereco}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Status:</span>
                <Badge variant={getStatusColor(supplier.status)}>
                  {supplier.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Informações Comerciais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Comerciais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Produtos Ativos:</span>
                <Badge variant="outline">
                  {supplier.produtosAtivos} produto{supplier.produtosAtivos !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Última Compra:</span>
                <span>{new Date(supplier.ultimaCompra).toLocaleDateString('pt-BR')}</span>
                {isRecentPurchase() && (
                  <Badge variant="default" className="text-xs">
                    Recente
                  </Badge>
                )}
              </div>

              {/* Indicadores de Performance */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Indicadores</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Relacionamento:</span>
                    <div className="font-medium">
                      {isRecentPurchase() ? "Ativo" : "Inativo"}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Portfólio:</span>
                    <div className="font-medium">
                      {supplier.produtosAtivos > 20 ? "Grande" :
                       supplier.produtosAtivos > 10 ? "Médio" : "Pequeno"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-500">📧</span>
                  Enviar email para fornecedor
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">📞</span>
                  Ligar para fornecedor
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-purple-500">📦</span>
                  Ver produtos do fornecedor
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-orange-500">📋</span>
                  Histórico de compras
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
