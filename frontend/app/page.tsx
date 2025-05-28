import Link from "next/link"
import { ArrowRight, Package, Users, TrendingUp, Warehouse } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function HomePage() {
  const features = [
    {
      icon: Package,
      title: "Gestão de Produtos",
      description: "Controle completo do seu catálogo de produtos com categorias e fornecedores"
    },
    {
      icon: Warehouse,
      title: "Controle de Estoque",
      description: "Monitore estoque em tempo real com alertas de baixo estoque"
    },
    {
      icon: Users,
      title: "Fornecedores",
      description: "Gerencie relacionamentos com fornecedores e histórico de compras"
    },
    {
      icon: TrendingUp,
      title: "Vendas & Relatórios",
      description: "Acompanhe vendas e gere relatórios detalhados do seu negócio"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16 pt-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Sistema de Gestão
            <span className="text-primary block">de Estoque</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Controle completo do seu estoque, produtos, fornecedores e vendas
            em uma única plataforma moderna e intuitiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/login">
                Entrar no Sistema
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/dashboard">
                Ver Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-card rounded-lg p-8 border">
          <h2 className="text-2xl font-bold text-center mb-8">
            Recursos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                Produtos
              </div>
              <p className="text-muted-foreground">
                Gestão completa com categorias e códigos únicos
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                Estoque
              </div>
              <p className="text-muted-foreground">
                Controle por depósito com alertas inteligentes
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                Relatórios
              </div>
              <p className="text-muted-foreground">
                Insights detalhados sobre seu negócio
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border pb-8">
          <p className="text-muted-foreground">
            © 2025 Sistema de Gestão de Estoque. Desenvolvido com Next.js e Tailwind CSS.
          </p>
        </footer>
      </div>
    </div>
  )
}
