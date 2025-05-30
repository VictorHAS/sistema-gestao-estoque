"use client"

import { useEffect, useState, useRef } from "react"
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
import { useCheckCategoriaExists } from "@/hooks/queries/useCategorias"

const categoryFormSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }).max(50, {
    message: "Nome deve ter no máximo 50 caracteres.",
  }),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryFormProps {
  initialData?: Partial<CategoryFormValues & { id: string }>
  onSubmit: (data: CategoryFormValues) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function CategoryForm({ initialData, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const isEditing = !!initialData?.id
  const [isCheckingName, setIsCheckingName] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [nameValidated, setNameValidated] = useState(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const checkCategoriaExists = useCheckCategoriaExists()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nome: initialData?.nome || "",
    },
  })

  useEffect(() => {
    const subscription = form.subscribe({
      formState: {
        values: true
      },
      callback: ({ values }) => {
        const nome = values.nome

        // Cancelar timeout anterior se existir
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }

        // Reset do estado de validação quando o usuário digita
        setNameValidated(false)

        if (nome && nome.length >= 2) {
          // Só validar se não estiver editando ou se o nome mudou
          const shouldValidate = !isEditing || nome.toLowerCase() !== initialData?.nome?.toLowerCase()

          if (shouldValidate) {
            // Criar novo timeout
            debounceTimeoutRef.current = setTimeout(() => {
              setIsCheckingName(true)
              setNameError(null)

              checkCategoriaExists.mutate(nome, {
                onSuccess: (result) => {
                  setIsCheckingName(false)
                  if (result.exists) {
                    setNameError("Já existe uma categoria com este nome!")
                    setNameValidated(false)
                  } else {
                    setNameError(null)
                    setNameValidated(true) // Nome válido e disponível
                  }
                },
                onError: () => {
                  setIsCheckingName(false)
                  setNameError(null) // Em caso de erro na verificação, não bloquear
                  setNameValidated(true) // Permitir submissão em caso de erro de rede
                }
              })
            }, 800) // 800ms de debounce
          } else {
            // Se estiver editando e o nome não mudou, considerar válido
            setNameValidated(true)
          }
        } else {
          setNameError(null)
          setIsCheckingName(false)
          setNameValidated(false) // Nome muito curto, não válido
        }
      }
    })

    // Cleanup: cancelar timeout pendente quando o componente for desmontado
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      subscription()
    }
  }, [form, checkCategoriaExists, isEditing, initialData?.nome])

  const handleSubmit = (data: CategoryFormValues) => {
    // Verificar se há erro de nome ou se ainda não foi validado
    if (nameError || !nameValidated) {
      return
    }
    onSubmit(data)
  }

  // Determinar se o submit deve estar desabilitado
  const isSubmitDisabled = isLoading || isCheckingName || !!nameError || !nameValidated

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Categoria" : "Nova Categoria"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize as informações da categoria"
            : "Adicione uma nova categoria para organizar seus produtos"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Informática, Periféricos, Cabos..." {...field} />
                  </FormControl>
                  <FormMessage />
                  {isCheckingName && (
                    <p className="text-sm text-muted-foreground">Verificando disponibilidade...</p>
                  )}
                  {nameError && (
                    <p className="text-sm text-destructive">{nameError}</p>
                  )}
                  {nameValidated && !nameError && !isCheckingName && field.value && field.value.length >= 2 && (
                    <p className="text-sm text-green-600">✓ Nome disponível</p>
                  )}
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitDisabled}
              >
                {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
