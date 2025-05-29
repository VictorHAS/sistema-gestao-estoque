"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { X } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const productFormSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }).max(100, {
    message: "Nome deve ter no máximo 100 caracteres.",
  }),
  descricao: z.string().optional(),
  codigo: z.string().min(1, {
    message: "Código é obrigatório.",
  }).max(20, {
    message: "Código deve ter no máximo 20 caracteres.",
  }),
  preco: z.number().positive({
    message: "Preço deve ser um valor positivo.",
  }),
  categoriaId: z.string({
    required_error: "Selecione uma categoria.",
  }),
  fornecedorIds: z.array(z.string()).min(1, {
    message: "Selecione pelo menos um fornecedor.",
  }),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  initialData?: Partial<ProductFormValues & { id: string }>
  onSubmit: (data: ProductFormValues) => void
  onCancel?: () => void
  isLoading?: boolean
}

// Mock data - in a real app, this would come from your API
const categorias = [
  { id: "1", nome: "Informática" },
  { id: "2", nome: "Periféricos" },
  { id: "3", nome: "Monitores" },
  { id: "4", nome: "Cabos" },
  { id: "5", nome: "Acessórios" },
]

const fornecedores = [
  { id: "1", nome: "Dell Brasil Ltda" },
  { id: "2", nome: "Logitech do Brasil" },
  { id: "3", nome: "Razer Inc" },
  { id: "4", nome: "Samsung Electronics" },
  { id: "5", nome: "TechCorp Distribuidora" },
  { id: "6", nome: "HP Brasil" },
  { id: "7", nome: "Lenovo" },
]

export function ProductForm({ initialData, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const isEditing = !!initialData?.id
  const [selectedFornecedores, setSelectedFornecedores] = useState<string[]>(
    initialData?.fornecedorIds || []
  )

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      descricao: initialData?.descricao || "",
      codigo: initialData?.codigo || "",
      preco: initialData?.preco || 0,
      categoriaId: initialData?.categoriaId || "",
      fornecedorIds: initialData?.fornecedorIds || [],
    },
  })

  const handleAddFornecedor = (fornecedorId: string) => {
    if (!selectedFornecedores.includes(fornecedorId)) {
      const newFornecedores = [...selectedFornecedores, fornecedorId]
      setSelectedFornecedores(newFornecedores)
      form.setValue("fornecedorIds", newFornecedores)
    }
  }

  const handleRemoveFornecedor = (fornecedorId: string) => {
    const newFornecedores = selectedFornecedores.filter(id => id !== fornecedorId)
    setSelectedFornecedores(newFornecedores)
    form.setValue("fornecedorIds", newFornecedores)
  }

  const getFornecedorNome = (id: string) => {
    return fornecedores.find(f => f.id === id)?.nome || "Fornecedor não encontrado"
  }

  const availableFornecedores = fornecedores.filter(f => !selectedFornecedores.includes(f.id))

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Produto" : "Novo Produto"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize as informações do produto"
            : "Adicione um novo produto ao catálogo"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Notebook Dell Inspiron" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: NB001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição detalhada do produto (opcional)"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Informações Comerciais */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informações Comerciais</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria.id} value={categoria.id}>
                              {categoria.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Gestão de Fornecedores */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Fornecedores</h3>

              {/* Adicionar Fornecedor */}
              {availableFornecedores.length > 0 && (
                <div className="mb-4">
                  <FormLabel>Adicionar Fornecedor</FormLabel>
                  <Select onValueChange={handleAddFornecedor}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione um fornecedor para adicionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFornecedores.map((fornecedor) => (
                        <SelectItem key={fornecedor.id} value={fornecedor.id}>
                          {fornecedor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Lista de Fornecedores Selecionados */}
              <FormField
                control={form.control}
                name="fornecedorIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Fornecedores Selecionados</FormLabel>
                    <div className="mt-2">
                      {selectedFornecedores.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Nenhum fornecedor selecionado
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedFornecedores.map((fornecedorId) => (
                            <Badge
                              key={fornecedorId}
                              variant="secondary"
                              className="flex items-center gap-1 px-3 py-1"
                            >
                              {getFornecedorNome(fornecedorId)}
                              <button
                                type="button"
                                onClick={() => handleRemoveFornecedor(fornecedorId)}
                                className="ml-1 hover:bg-muted rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-3 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
