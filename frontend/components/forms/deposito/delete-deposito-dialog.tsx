"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Warehouse, AlertTriangle, MapPin, Calendar } from "lucide-react"

interface Deposito {
  id: string
  nome: string
  localizacao: string
  dataCriacao: string
  estoque: Array<{
    produto: string
    quantidade: number
  }>
}

interface DeleteDepositoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deposito: Deposito | null
  onConfirm: (id: string) => void
  isLoading?: boolean
}

export function DeleteDepositoDialog({
  open,
  onOpenChange,
  deposito,
  onConfirm,
  isLoading
}: DeleteDepositoDialogProps) {
  if (!deposito) return null

  const handleConfirm = () => {
    onConfirm(deposito.id)
  }

  const totalItens = deposito.estoque.length
  const totalQuantidade = deposito.estoque.reduce((acc, item) => acc + item.quantidade, 0)
  const temEstoque = totalItens > 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Excluir Depósito
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Tem certeza que deseja excluir este depósito? Esta ação não pode ser desfeita.
              </p>

              {/* Detalhes do depósito a ser excluído */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Depósito:</span>
                  <span>{deposito.nome}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <span className="font-medium">Localização:</span>
                    <p className="text-sm text-muted-foreground">{deposito.localizacao}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Criado em:</span>
                  <span>{new Date(deposito.dataCriacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Produtos:</span>
                  <Badge variant={temEstoque ? "destructive" : "outline"}>
                    {totalItens} produto(s) - {totalQuantidade} unidades
                  </Badge>
                </div>
              </div>

              {/* Lista de produtos em estoque */}
              {temEstoque && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="font-medium text-sm mb-2">Produtos em estoque:</p>
                  <div className="text-sm space-y-1 max-h-24 overflow-y-auto">
                    {deposito.estoque.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.produto}</span>
                        <span>{item.quantidade} un.</span>
                      </div>
                    ))}
                    {deposito.estoque.length > 5 && (
                      <div className="text-muted-foreground text-xs">
                        ... e mais {deposito.estoque.length - 5} produto(s)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Avisos sobre impactos */}
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">Atenção:</p>
                    <p className="text-muted-foreground mt-1">
                      A exclusão deste depósito afetará:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                      <li>Histórico de movimentações de estoque</li>
                      <li>Relatórios e controles por localização</li>
                      {temEstoque && (
                        <>
                          <li className="text-destructive">⚠️ {totalItens} produto(s) com estoque ativo</li>
                          <li className="text-destructive">⚠️ {totalQuantidade} unidades serão perdidas</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Aviso especial para depósitos com estoque */}
              {temEstoque && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Este depósito possui produtos em estoque! Considere transferi-los antes de excluir.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Excluindo..." : "Excluir Depósito"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
