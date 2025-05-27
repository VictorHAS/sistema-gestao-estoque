"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, LogIn, Package, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useAuth } from "@/lib/auth"

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Digite um email válido.",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória.",
  }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const success = await login(data.email, data.password)
      if (success) {
        router.push("/dashboard")
      } else {
        form.setError("password", {
          message: "Email ou senha incorretos.",
        })
      }
    } catch (e) {
      console.error(e)
      form.setError("password", {
        message: "Erro ao fazer login. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const mockCredentials = [
    { email: "admin@sistema.com", cargo: "Admin" },
    { email: "maria@sistema.com", cargo: "Gerente" },
    { email: "joao@sistema.com", cargo: "Funcionário" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Branding */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Package className="mr-2 h-6 w-6" />
            Sistema de Gestão
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &quot;Controle total do seu estoque, vendas e fornecedores em uma única plataforma moderna e intuitiva.&quot;
              </p>
              <footer className="text-sm">Sistema de Gestão de Estoque</footer>
            </blockquote>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-primary mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para home
              </Link>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Entrar na sua conta
              </h1>
              <p className="text-sm text-muted-foreground">
                Digite suas credenciais para acessar o sistema
              </p>
            </div>

            <Card className="border-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Login</CardTitle>
                <CardDescription>
                  Acesse o sistema de gestão de estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="seu@email.com"
                              type="email"
                              autoComplete="email"
                              className="bg-input border-border text-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className="bg-input border-border text-foreground pr-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Entrando..."
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Entrar
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Mock Credentials Info */}
                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-2">
                    Credenciais de Teste:
                  </h4>
                  <div className="space-y-1 text-xs text-slate-300">
                    {mockCredentials.map((cred, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{cred.email}</span>
                        <span className="text-slate-400">({cred.cargo})</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-600">
                      <span className="text-slate-400">Senha para todos: </span>
                      <code className="text-white bg-slate-800 px-1 rounded">123456</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
