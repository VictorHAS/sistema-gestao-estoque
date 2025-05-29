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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const depositoFormSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }).max(100, {
    message: "Nome deve ter no máximo 100 caracteres.",
  }),
  localizacao: z.string().min(5, {
    message: "Localização deve ter pelo menos 5 caracteres.",
  }).max(200, {
    message: "Localização deve ter no máximo 200 caracteres.",
  }),
})

type DepositoFormValues = z.infer<typeof depositoFormSchema>

interface DepositoFormProps {
  initialData?: Partial<DepositoFormValues & { id: string }>
  onSubmit: (data: DepositoFormValues) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function DepositoForm({ initialData, onSubmit, onCancel, isLoading }: DepositoFormProps) {
  const isEditing = !!initialData?.id

  const form = useForm<DepositoFormValues>({
    resolver: zodResolver(depositoFormSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      localizacao: initialData?.localizacao || "",
    },
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Depósito" : "Novo Depósito"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize as informações do depósito"
            : "Cadastre um novo depósito para controle de estoque"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Depósito</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Depósito Central, Filial São Paulo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localizacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Endereço completo do depósito..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar Depósito"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
