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

const itemVendaSchema = z.object({
  produtoId: z.string().min(1, "Selecione um produto"),
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  precoUnitario: z.number().positive("Preço deve ser positivo"),
})

const vendaFormSchema = z.object({
  clienteNome: z.string().min(2, {
    message: "Nome do cliente deve ter pelo menos 2 caracteres.",
  }).max(100, {
    message: "Nome deve ter no máximo 100 caracteres.",
  }),
  clienteEmail: z.string().email({
    message: "Email inválido.",
  }).optional().or(z.literal("")),
  clienteTelefone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 caracteres.",
  }).max(15, {
    message: "Telefone deve ter no máximo 15 caracteres.",
  }),
  itens: z.array(itemVendaSchema).min(1, {
    message: "Adicione pelo menos um produto à venda.",
  }),
  formaPagamento: z.enum(["DINHEIRO", "CARTAO_CREDITO", "CARTAO_DEBITO", "PIX", "BOLETO"], {
    required_error: "Selecione uma forma de pagamento.",
  }),
  observacoes: z.string().optional(),
})

type VendaFormValues = z.infer<typeof vendaFormSchema>
type ItemVenda = z.infer<typeof itemVendaSchema>

interface VendaFormProps {
  initialData?: Partial<VendaFormValues & { id: string }>
  onSubmit: (data: VendaFormValues) => void
  onCancel?: () => void
  isLoading?: boolean
}

// Mock data - in a real app, this would come from your API
const produtos = [
  { id: "1", nome: "Notebook Dell Inspiron 15", codigo: "NB001", preco: 2899.99, estoque: 15 },
  { id: "2", nome: "Mouse Logitech MX Master 3", codigo: "MS001", preco: 399.99, estoque: 25 },
  { id: "3", nome: "Teclado Razer BlackWidow V3", codigo: "TC001", preco: 189.99, estoque: 8 },
  { id: "4", nome: "Monitor Samsung 24\"", codigo: "MT001", preco: 799.99, estoque: 5 },
  { id: "5", nome: "Cabo HDMI 2m", codigo: "CB001", preco: 29.99, estoque: 50 },
]

const formasPagamento = [
  { value: "DINHEIRO", label: "Dinheiro", icon: "💵" },
  { value: "CARTAO_CREDITO", label: "Cartão de Crédito", icon: "💳" },
  { value: "CARTAO_DEBITO", label: "Cartão de Débito", icon: "💳" },
  { value: "PIX", label: "PIX", icon: "📱" },
  { value: "BOLETO", label: "Boleto", icon: "📄" },
]

export function VendaForm({ initialData, onSubmit, onCancel, isLoading }: VendaFormProps) {
  const isEditing = !!initialData?.id
  const [itens, setItens] = useState<Array<{
    produtoId: string
    quantidade: number
    precoUnitario: number
  }>>(initialData?.itens || [])

  const form = useForm<VendaFormValues>({
    resolver: zodResolver(vendaFormSchema),
    defaultValues: {
      clienteNome: initialData?.clienteNome || "",
      clienteEmail: initialData?.clienteEmail || "",
      clienteTelefone: initialData?.clienteTelefone || "",
      itens: initialData?.itens || [],
      formaPagamento: initialData?.formaPagamento || "DINHEIRO",
      observacoes: initialData?.observacoes || "",
    },
  })

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
        novosItens[index].precoUnitario = produto.preco
      }
    }

    setItens(novosItens)
    form.setValue("itens", novosItens)
  }

  const getProduto = (produtoId: string) => {
    return produtos.find(p => p.id === produtoId)
  }

  const calcularSubtotal = (item: ItemVenda) => {
    return item.quantidade * item.precoUnitario
  }

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + calcularSubtotal(item), 0)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Venda" : "Nova Venda"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize os dados da venda"
            : "Registre uma nova venda no sistema"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações do Cliente */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações do Cliente</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clienteNome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clienteTelefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clienteEmail"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Email (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="cliente@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Produtos da Venda */}
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
                                      {produto.codigo} - R$ {produto.preco.toFixed(2)} - Estoque: {produto.estoque}
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
                            max={getProduto(item.produtoId)?.estoque || 999}
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
                          <div className="text-lg font-bold text-green-600">
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

                      {/* Aviso de Estoque */}
                      {item.produtoId && getProduto(item.produtoId) && (
                        <div className="mt-2">
                          {item.quantidade > (getProduto(item.produtoId)?.estoque || 0) && (
                            <div className="text-sm text-destructive">
                              ⚠️ Quantidade maior que o estoque disponível ({getProduto(item.produtoId)?.estoque})
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}

                  {/* Total da Venda */}
                  <Card className="p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Total da Venda:</span>
                      <span className="text-2xl font-bold text-green-600">
                        R$ {calcularTotal().toFixed(2)}
                      </span>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            <Separator />

            {/* Forma de Pagamento */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Pagamento</h3>
              <FormField
                control={form.control}
                name="formaPagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formasPagamento.map((forma) => (
                          <SelectItem key={forma.value} value={forma.value}>
                            <div className="flex items-center gap-2">
                              <span>{forma.icon}</span>
                              {forma.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre a venda"
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
                {isLoading ? "Processando..." : isEditing ? "Atualizar Venda" : "Finalizar Venda"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
