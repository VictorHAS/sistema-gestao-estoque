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

const userFormSchema = z.object({
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Digite um email válido.",
  }),
  senha: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }).optional(),
  cargo: z.enum(["ADMIN", "GERENTE", "FUNCIONARIO"], {
    required_error: "Selecione um cargo.",
  }),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  initialData?: Partial<UserFormValues & { id: string }>
  onSubmit: (data: UserFormValues) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
  const isEditing = !!initialData?.id

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      senha: "",
      cargo: initialData?.cargo || "FUNCIONARIO",
    },
  })

  const handleSubmit = (data: UserFormValues) => {
    // If editing and password is empty, remove it from the data
    if (isEditing && !data.senha) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha, ...dataWithoutPassword } = data
      onSubmit(dataWithoutPassword as UserFormValues)
    } else {
      onSubmit(data)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Usuário" : "Novo Usuário"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Atualize as informações do usuário"
            : "Adicione um novo usuário ao sistema"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
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
                        placeholder="usuario@exemplo.com"
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
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isEditing ? "Nova Senha (deixe em branco para manter a atual)" : "Senha"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={isEditing ? "••••••••" : "Digite a senha"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
                        <SelectItem value="GERENTE">Gerente</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
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
