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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const supplierFormSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }).max(100, {
    message: "Nome deve ter no máximo 100 caracteres.",
  }),
  email: z.string().email({
    message: "Digite um email válido.",
  }),
  telefone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 caracteres.",
  }).max(20, {
    message: "Telefone deve ter no máximo 20 caracteres.",
  }),
  endereco: z.string().min(5, {
    message: "Endereço deve ter pelo menos 5 caracteres.",
  }).max(200, {
    message: "Endereço deve ter no máximo 200 caracteres.",
  }),
})

type SupplierFormValues = z.infer<typeof supplierFormSchema>

interface SupplierFormProps {
  initialData?: Partial<SupplierFormValues & { id: string }>
  onSubmit: (data: SupplierFormValues) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function SupplierForm({ initialData, onSubmit, onCancel, isLoading }: SupplierFormProps) {
  const isEditing = !!initialData?.id

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      telefone: initialData?.telefone || "",
      endereco: initialData?.endereco || "",
    },
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Fornecedor" : "Novo Fornecedor"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize as informações do fornecedor"
            : "Adicione um novo fornecedor ao sistema"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Fornecedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dell Brasil Ltda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="comercial@fornecedor.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="(11) 9999-9999"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cidade, Estado - País"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
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
