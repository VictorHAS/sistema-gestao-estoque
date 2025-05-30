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
import { Badge } from "@/components/ui/badge"
import { useFornecedores } from "@/hooks/queries/useFornecedores"
import { useProdutos } from "@/hooks/queries/useProdutos"

const compraFormSchema = z.object({
  produtoId: z.string({
    required_error: "Selecione um produto.",
  }),
  fornecedorId: z.string({
    required_error: "Selecione um fornecedor.",
  }),
  quantidade: z.number().min(1, {
    message: "Quantidade deve ser maior que 0.",
  }),
})

type CompraFormValues = z.infer<typeof compraFormSchema>

interface CompraFormProps {
  initialData?: Partial<CompraFormValues & { id: string }>
  onSubmit: (data: CompraFormValues) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function CompraForm({ initialData, onSubmit, onCancel, isLoading }: CompraFormProps) {
  const isEditing = !!initialData?.id

  // Hooks para buscar dados reais
  const { data: fornecedores = [] } = useFornecedores()
  const { data: produtos = [] } = useProdutos()

  const form = useForm<CompraFormValues>({
    resolver: zodResolver(compraFormSchema),
    defaultValues: {
      produtoId: initialData?.produtoId || "",
      fornecedorId: initialData?.fornecedorId || "",
      quantidade: initialData?.quantidade || 1,
    },
  })

  const fornecedorSelecionado = form.watch("fornecedorId")
  const produtoSelecionado = form.watch("produtoId")

  const getFornecedor = (fornecedorId: string) => {
    return fornecedores.find(f => f.id === fornecedorId)
  }

  const getProduto = (produtoId: string) => {
    return produtos.find(p => p.id === produtoId)
  }

  const calcularTotal = () => {
    const produto = getProduto(produtoSelecionado)
    const quantidade = form.watch("quantidade")

    if (!produto || !quantidade) return 0

    // Usando preco do produto
    const preco = produto.preco || 0
    return quantidade * preco
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Compra" : "Nova Compra"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize os dados da compra"
            : "Registre uma nova compra de produto"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Seleção do Fornecedor */}
            <FormField
              control={form.control}
              name="fornecedorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor</FormLabel>
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
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getFornecedor(fornecedorSelecionado)?.nome}</p>
                    <p className="text-sm text-muted-foreground">{getFornecedor(fornecedorSelecionado)?.email}</p>
                  </div>
                  <Badge variant="outline">Selecionado</Badge>
                </div>
              </div>
            )}

            {/* Seleção do Produto */}
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
                            <span className="font-medium">{produto.nome}</span>
                            <span className="text-xs text-muted-foreground">
                              {produto.codigo} - R$ {(produto.preco || 0).toFixed(2)}
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

            {produtoSelecionado && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getProduto(produtoSelecionado)?.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      Código: {getProduto(produtoSelecionado)?.codigo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Preço Unitário</p>
                    <p className="font-bold">
                      R$ {(getProduto(produtoSelecionado)?.preco || 0).toFixed(2)}
                    </p>
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
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Estimado */}
            {produtoSelecionado && form.watch("quantidade") > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Estimado:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {calcularTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processando..." : isEditing ? "Atualizar Compra" : "Registrar Compra"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
