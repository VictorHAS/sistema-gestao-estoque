# 🏢 Sistema de Gestão de Estoque

Um sistema moderno e completo para gestão de estoque, produtos, fornecedores e vendas construído com **Next.js 15**, **Shadcn UI**, **Tailwind CSS** e **TypeScript**.

![Sistema de Gestão](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Funcionalidades

### 🔐 **Autenticação**
- Sistema de login com validação
- Controle de acesso por cargo (Admin, Gerente, Funcionário)
- Proteção de rotas automática
- Logout seguro

### 📊 **Dashboard**
- Visão geral com métricas importantes
- Cards com estatísticas em tempo real
- Alertas de baixo estoque
- Vendas recentes

### 📦 **Gestão de Produtos**
- Cadastro completo de produtos
- Categorização e códigos únicos
- Controle de preços
- Vinculação com fornecedores

### 🏭 **Fornecedores**
- Cadastro de fornecedores
- Histórico de compras
- Informações de contato
- Status ativo/inativo

### 📋 **Categorias**
- Organização por categorias
- Contagem de produtos por categoria
- Gestão simples e intuitiva

### 🏪 **Controle de Estoque**
- Monitoramento por depósito
- Níveis mínimos e máximos
- Histórico de movimentações
- Alertas automáticos

### 💰 **Vendas**
- Registro de vendas
- Controle de status
- Cálculo automático de valores
- Relatórios de faturamento

## 🎨 **Design Moderno**

### Paleta de Cores Personalizada
- **Primária**: Azul índigo profundo (`#4F46E5`)
- **Secundária**: Roxo vibrante (`#8B5CF6`)
- **Sucesso**: Verde esmeralda (`#22C55E`)
- **Aviso**: Âmbar dourado (`#F59E0B`)
- **Erro**: Vermelho coral (`#EF4444`)

### Características Visuais
- ⚡ Gradientes modernos
- 🌙 Modo escuro/claro
- 📱 Design responsivo
- ✨ Animações suaves
- 🎯 Interface intuitiva

## 🔑 **Credenciais de Teste**

| Email | Senha | Cargo |
|-------|--------|-------|
| `admin@sistema.com` | `123456` | **Admin** |
| `maria@sistema.com` | `123456` | **Gerente** |
| `joao@sistema.com` | `123456` | **Funcionário** |

## 🚀 **Como Usar**

### 1. **Instalação**
```bash
npm install
```

### 2. **Desenvolvimento**
```bash
npm run dev
```

### 3. **Acesso**
- Abra `http://localhost:3000`
- Clique em "Entrar no Sistema"
- Use qualquer credencial da tabela acima
- Explore o dashboard e funcionalidades

## 🛠️ **Tecnologias**

### **Frontend**
- **Next.js 15** - Framework React moderno
- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilos
- **Shadcn UI** - Componentes acessíveis

### **Formulários & Validação**
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **@hookform/resolvers** - Integração Hook Form + Zod

### **UI & UX**
- **Lucide React** - Ícones modernos
- **next-themes** - Controle de temas
- **class-variance-authority** - Variants de componentes

## 📁 **Estrutura do Projeto**

```
frontend/
├── app/                    # App Router (Next.js 15)
│   ├── dashboard/          # Páginas do dashboard
│   │   ├── produtos/       # Gestão de produtos
│   │   ├── fornecedores/   # Gestão de fornecedores
│   │   ├── estoque/        # Controle de estoque
│   │   ├── vendas/         # Gestão de vendas
│   │   └── categorias/     # Gestão de categorias
│   ├── login/              # Página de login
│   └── globals.css         # Estilos globais customizados
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes Shadcn UI
│   ├── forms/              # Formulários especializados
│   ├── app-sidebar.tsx     # Sidebar principal
│   ├── header.tsx          # Header com autenticação
│   └── auth-guard.tsx      # Proteção de rotas
└── lib/                    # Utilitários e configurações
    ├── auth.tsx            # Sistema de autenticação
    └── utils.ts            # Funções utilitárias
```

## 🎯 **Próximos Passos**

- 🔌 **Integração com API**: Conectar com backend real
- 📊 **Gráficos Avançados**: Implementar charts com Recharts
- 📄 **Relatórios**: Sistema completo de relatórios
- 🔔 **Notificações**: Sistema de notificações em tempo real
- 📱 **PWA**: Transformar em Progressive Web App

---

⭐ **Desenvolvido com Next.js 15 + Shadcn UI + Tailwind CSS**
