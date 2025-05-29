"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const estoqueFormSchema = z.object({
  produtoId: z.string({
    required_error: "Selecione um produto.",
  }),
  tipo: z.enum(["ENTRADA", "SAIDA"], {
    required_error: "Selecione o tipo de movimentação.",
  }),
  quantidade: z.number().positive({
    message: "Quantidade deve ser um valor positivo.",
  }),
  motivo: z.string().min(3, {
    message: "Motivo deve ter pelo menos 3 caracteres.",
  }).max(200, {
    message: "Motivo deve ter no máximo 200 caracteres.",
  }),
  observacoes: z.string().optional(),
})

type EstoqueFormValues = z.infer<typeof estoqueFormSchema>

interface EstoqueFormProps {
  initialData?: Partial<EstoqueFormValues & { id: string }>
  onSubmit: (data: EstoqueFormValues) => void
  onCancel?: () => void
  isLoading?: boolean
}

// Mock data - in a real app, this would come from your API
const produtos = [
  { id: "1", nome: "Notebook Dell Inspiron 15", codigo: "NB001", estoqueAtual: 15 },
  { id: "2", nome: "Mouse Logitech MX Master 3", codigo: "MS001", estoqueAtual: 25 },
  { id: "3", nome: "Teclado Razer BlackWidow V3", codigo: "TC001", estoqueAtual: 8 },
  { id: "4", nome: "Monitor Samsung 24\"", codigo: "MT001", estoqueAtual: 5 },
  { id: "5", nome: "Cabo HDMI 2m", codigo: "CB001", estoqueAtual: 50 },
]

const motivosEntrada = [
  "Compra de mercadoria",
  "Devolução de cliente",
  "Ajuste de inventário (positivo)",
  "Transferência entre filiais",
  "Doação recebida",
  "Outros"
]

const motivosSaida = [
  "Venda ao cliente",
  "Devolução ao fornecedor",
  "Ajuste de inventário (negativo)",
  "Transferência entre filiais",
  "Perda/Avaria",
  "Uso interno",
  "Outros"
]

export function EstoqueForm({ initialData, onSubmit, onCancel, isLoading }: EstoqueFormProps) {
  const isEditing = !!initialData?.id

  const form = useForm<EstoqueFormValues>({
    resolver: zodResolver(estoqueFormSchema),
    defaultValues: {
      produtoId: initialData?.produtoId || "",
      tipo: initialData?.tipo || "ENTRADA",
      quantidade: initialData?.quantidade || 0,
      motivo: initialData?.motivo || "",
      observacoes: initialData?.observacoes || "",
    },
  })

  const tipoSelecionado = form.watch("tipo")
  const produtoSelecionado = form.watch("produtoId")

  const produto = produtos.find(p => p.id === produtoSelecionado)
  const motivosDisponiveis = tipoSelecionado === "ENTRADA" ? motivosEntrada : motivosSaida

  const getTipoColor = (tipo: string) => {
    return tipo === "ENTRADA" ? "default" : "destructive"
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === "ENTRADA" ? "📦" : "📤"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Movimentação" : "Nova Movimentação de Estoque"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize os dados da movimentação de estoque"
            : "Registre uma entrada ou saída de produtos do estoque"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo de Movimentação */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Movimentação</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ENTRADA">
                        <div className="flex items-center gap-2">
                          <span>📦</span>
                          Entrada
                        </div>
                      </SelectItem>
                      <SelectItem value="SAIDA">
                        <div className="flex items-center gap-2">
                          <span>📤</span>
                          Saída
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tipoSelecionado && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTipoIcon(tipoSelecionado)}</span>
                  <Badge variant={getTipoColor(tipoSelecionado)}>
                    {tipoSelecionado}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tipoSelecionado === "ENTRADA"
                      ? "Aumentará o estoque do produto"
                      : "Diminuirá o estoque do produto"
                    }
                  </span>
                </div>
              </div>
            )}

            <Separator />

            {/* Produto */}
            <FormField
              control={form.control}
              name="produtoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {produtos.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id}>
                          <div className="flex flex-col items-start">
                            <span>{produto.nome}</span>
                            <span className="text-xs text-muted-foreground">
                              {produto.codigo} - Estoque atual: {produto.estoqueAtual}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {produto && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{produto.nome}</p>
                    <p className="text-sm text-muted-foreground">Código: {produto.codigo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Estoque Atual</p>
                    <p className="text-lg font-bold">{produto.estoqueAtual} un.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quantidade */}
            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Digite a quantidade"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motivo */}
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {motivosDisponiveis.map((motivo) => (
                        <SelectItem key={motivo} value={motivo}>
                          {motivo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre a movimentação"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processando..." : isEditing ? "Atualizar" : "Registrar Movimentação"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
