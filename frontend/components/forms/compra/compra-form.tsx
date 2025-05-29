"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2 } from "lucide-react"

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

const itemCompraSchema = z.object({
  produtoId: z.string().min(1, "Selecione um produto"),
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  precoUnitario: z.number().positive("Preço deve ser positivo"),
})

const compraFormSchema = z.object({
  fornecedorId: z.string({
    required_error: "Selecione um fornecedor.",
  }),
  itens: z.array(itemCompraSchema).min(1, {
    message: "Adicione pelo menos um produto à compra.",
  }),
  dataEntrega: z.string().min(1, {
    message: "Selecione a data de entrega prevista.",
  }),
  observacoes: z.string().optional(),
})

type CompraFormValues = z.infer<typeof compraFormSchema>
type ItemCompra = z.infer<typeof itemCompraSchema>

interface CompraFormProps {
  initialData?: Partial<CompraFormValues & { id: string }>
  onSubmit: (data: CompraFormValues) => void
  onCancel?: () => void
  isLoading?: boolean
}

// Mock data - in a real app, this would come from your API
const fornecedores = [
  { id: "1", nome: "TechDistribuidor Ltda", email: "compras@techdist.com" },
  { id: "2", nome: "Eletrônicos Silva", email: "vendas@eletronicos.com" },
  { id: "3", nome: "InfoParts Brasil", email: "atendimento@infoparts.com" },
  { id: "4", nome: "CompuMega Distribuidora", email: "pedidos@compumega.com" },
]

const produtos = [
  { id: "1", nome: "Notebook Dell Inspiron 15", codigo: "NB001", precoCompra: 2500.00, estoqueAtual: 15 },
  { id: "2", nome: "Mouse Logitech MX Master 3", codigo: "MS001", precoCompra: 320.00, estoqueAtual: 25 },
  { id: "3", nome: "Teclado Razer BlackWidow V3", codigo: "TC001", precoCompra: 150.00, estoqueAtual: 8 },
  { id: "4", nome: "Monitor Samsung 24\"", codigo: "MT001", precoCompra: 650.00, estoqueAtual: 5 },
  { id: "5", nome: "Cabo HDMI 2m", codigo: "CB001", precoCompra: 20.00, estoqueAtual: 50 },
]

export function CompraForm({ initialData, onSubmit, onCancel, isLoading }: CompraFormProps) {
  const isEditing = !!initialData?.id
  const [itens, setItens] = useState<Array<{
    produtoId: string
    quantidade: number
    precoUnitario: number
  }>>(initialData?.itens || [])

  const form = useForm<CompraFormValues>({
    resolver: zodResolver(compraFormSchema),
    defaultValues: {
      fornecedorId: initialData?.fornecedorId || "",
      itens: initialData?.itens || [],
      dataEntrega: initialData?.dataEntrega || "",
      observacoes: initialData?.observacoes || "",
    },
  })

  const fornecedorSelecionado = form.watch("fornecedorId")

  const adicionarItem = () => {
    const novoItem = {
      produtoId: "",
      quantidade: 1,
      precoUnitario: 0,
    }
    const novosItens = [...itens, novoItem]
    setItens(novosItens)
    form.setValue("itens", novosItens)
  }

  const removerItem = (index: number) => {
    const novosItens = itens.filter((_, i) => i !== index)
    setItens(novosItens)
    form.setValue("itens", novosItens)
  }

  const atualizarItem = (index: number, campo: string, valor: string | number) => {
    const novosItens = [...itens]
    novosItens[index] = { ...novosItens[index], [campo]: valor }

    // Se mudou o produto, atualiza o preço automaticamente
    if (campo === "produtoId") {
      const produto = produtos.find(p => p.id === valor)
      if (produto) {
        novosItens[index].precoUnitario = produto.precoCompra
      }
    }

    setItens(novosItens)
    form.setValue("itens", novosItens)
  }

  const getFornecedor = (fornecedorId: string) => {
    return fornecedores.find(f => f.id === fornecedorId)
  }

  const getProduto = (produtoId: string) => {
    return produtos.find(p => p.id === produtoId)
  }

  const calcularSubtotal = (item: ItemCompra) => {
    return item.quantidade * item.precoUnitario
  }

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + calcularSubtotal(item), 0)
  }

  const getDataMinimaEntrega = () => {
    const hoje = new Date()
    hoje.setDate(hoje.getDate() + 1) // Mínimo amanhã
    return hoje.toISOString().split('T')[0]
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Compra" : "Nova Compra"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize os dados da compra"
            : "Registre uma nova compra de produtos para reposição de estoque"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações do Fornecedor */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Fornecedor</h3>
              <FormField
                control={form.control}
                name="fornecedorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecionar Fornecedor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um fornecedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fornecedores.map((fornecedor) => (
                          <SelectItem key={fornecedor.id} value={fornecedor.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{fornecedor.nome}</span>
                              <span className="text-xs text-muted-foreground">{fornecedor.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fornecedorSelecionado && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{getFornecedor(fornecedorSelecionado)?.nome}</p>
                      <p className="text-sm text-muted-foreground">{getFornecedor(fornecedorSelecionado)?.email}</p>
                    </div>
                    <Badge variant="outline">Selecionado</Badge>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Produtos da Compra */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Produtos</h3>
                <Button type="button" onClick={adicionarItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>

              {itens.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg">
                  <p>Nenhum produto adicionado</p>
                  <p className="text-sm">Clique em &quot;Adicionar Produto&quot; para começar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {itens.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                        {/* Produto */}
                        <div className="lg:col-span-5">
                          <label className="text-sm font-medium">Produto</label>
                          <Select
                            value={item.produtoId}
                            onValueChange={(value) => atualizarItem(index, "produtoId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                            <SelectContent>
                              {produtos.map((produto) => (
                                <SelectItem key={produto.id} value={produto.id}>
                                  <div className="flex flex-col items-start">
                                    <span>{produto.nome}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {produto.codigo} - R$ {produto.precoCompra.toFixed(2)} - Estoque: {produto.estoqueAtual}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Quantidade */}
                        <div className="lg:col-span-2">
                          <label className="text-sm font-medium">Quantidade</label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantidade}
                            onChange={(e) => atualizarItem(index, "quantidade", parseInt(e.target.value) || 1)}
                          />
                        </div>

                        {/* Preço Unitário */}
                        <div className="lg:col-span-2">
                          <label className="text-sm font-medium">Preço Unit.</label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.precoUnitario}
                            onChange={(e) => atualizarItem(index, "precoUnitario", parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        {/* Subtotal */}
                        <div className="lg:col-span-2">
                          <label className="text-sm font-medium">Subtotal</label>
                          <div className="text-lg font-bold text-blue-600">
                            R$ {calcularSubtotal(item).toFixed(2)}
                          </div>
                        </div>

                        {/* Remover */}
                        <div className="lg:col-span-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerItem(index)}
                            className="w-full text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Info do Produto */}
                      {item.produtoId && getProduto(item.produtoId) && (
                        <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span>Estoque atual: <strong>{getProduto(item.produtoId)?.estoqueAtual}</strong></span>
                            <span>Novo estoque: <strong>{(getProduto(item.produtoId)?.estoqueAtual || 0) + item.quantidade}</strong></span>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}

                  {/* Total da Compra */}
                  <Card className="p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Total da Compra:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        R$ {calcularTotal().toFixed(2)}
                      </span>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            <Separator />

            {/* Data de Entrega */}
            <FormField
              control={form.control}
              name="dataEntrega"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Entrega Prevista</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={getDataMinimaEntrega()}
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Informações adicionais sobre a compra, condições de pagamento, etc."
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
              <Button type="submit" disabled={isLoading || itens.length === 0}>
                {isLoading ? "Processando..." : isEditing ? "Atualizar Compra" : "Registrar Compra"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
