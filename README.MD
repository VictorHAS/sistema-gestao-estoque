# Sistema de Gestão de Estoque

Este é um projeto de sistema de gestão de estoque desenvolvido como trabalho para a disciplina de Desenvolvimento Web II da UFRN/IMD.

## Visão Geral

O sistema permite gerenciar produtos, categorias, fornecedores, compras, vendas e controle de estoque em múltiplos depósitos. Possui diferentes níveis de acesso (admin, gerente, funcionário) e implementa autenticação segura com JWT.

## Tecnologias Utilizadas

### Backend
- **Fastify**: Framework web rápido e eficiente para Node.js
- **Prisma ORM**: ORM moderno para Node.js e TypeScript
- **PostgreSQL**: Banco de dados relacional
- **TypeScript**: Linguagem de programação tipada
- **JWT**: Autenticação baseada em tokens

### Frontend
- **Next.js**: Framework React para aplicações web
- **React**: Biblioteca JavaScript para construção de interfaces
- **TailwindCSS**: Framework CSS utilitário
- **Axios**: Cliente HTTP para requisições à API

## Requisitos do Sistema

O sistema implementa os seguintes requisitos:

1. Gerenciamento de usuários com diferentes níveis de acesso
2. Cadastro e gerenciamento de produtos
3. Categorização de produtos
4. Gerenciamento de fornecedores
5. Registro e acompanhamento de compras
6. Registro e acompanhamento de vendas
7. Controle de estoque em múltiplos depósitos
8. Alertas de estoque baixo
9. Relatórios de movimentação de estoque
10. Dashboard com indicadores principais

## Estrutura do Projeto

```
sistema-gestao-estoque/
├── backend/                # API Fastify
│   ├── prisma/             # Configuração e modelos do Prisma
│   ├── src/
│   │   ├── config/         # Configurações do servidor
│   │   ├── controllers/    # Controladores da API
│   │   ├── middlewares/    # Middlewares (autenticação, etc)
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Lógica de negócio
│   │   ├── utils/          # Utilitários
│   │   └── servidor.ts     # Ponto de entrada do servidor
│   └── package.json
├── docker-compose.yml      # Configuração do Docker
│
└── frontend/               # Aplicação Next.js
    ├── public/             # Arquivos estáticos
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── contexts/       # Contextos React (auth, etc)
    │   ├── hooks/          # Hooks personalizados
    │   ├── pages/          # Páginas da aplicação
    │   ├── services/       # Serviços de API
    │   ├── styles/         # Estilos globais
    │   └── utils/          # Utilitários
    └── package.json
```

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js (v16+)
- npm ou yarn
- PostgreSQL

## Configuração do Banco de Dados com Docker

O projeto inclui um arquivo `docker-compose.yml` que facilita a configuração do banco de dados PostgreSQL para desenvolvimento.

### Pré-requisitos
- Docker
- Docker Compose

### Iniciando o Banco de Dados

1. Na raiz do projeto, execute:
   ```bash
   docker-compose up -d
   ```

2. Isso iniciará:
   - PostgreSQL na porta 5432
   - pgAdmin (interface web para gerenciar o PostgreSQL) na porta 5050

3. Acesse o pgAdmin:
   - URL: http://localhost:5050
   - Email: admin@admin.com
   - Senha: admin

4. Para conectar ao PostgreSQL no pgAdmin:
   - Host: postgres
   - Porta: 5432
   - Usuário: postgres
   - Senha: postgres
   - Banco de dados: gestao_estoque

### Configuração do .env

Configure seu arquivo `.env` para conectar ao banco de dados:

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### Parando o Banco de Dados

Para parar os contêineres:
```bash
docker-compose down
```

Para parar e remover os volumes (isso apagará todos os dados):
```bash
docker-compose down -v
```

Este Docker Compose configura:

1. Um servidor PostgreSQL na porta 5432
2. Uma instância do pgAdmin (interface web para gerenciar o PostgreSQL) na porta 5050
3. Volumes persistentes para manter os dados mesmo após reiniciar os contêineres
4. Uma rede dedicada para comunicação entre os serviços

### Backend

1. Entre na pasta do backend
   ```bash
   cd backend
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Execute as migrações do banco de dados
   ```bash
   npm run prisma:migrate
   ```

4. Gere o Prisma Client
   ```bash
   npm run prisma:generate
   ```

5. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   ```

### Frontend

Ainda não implementado.

## Entidades do Sistema

1. **Usuario**: Usuários do sistema com diferentes níveis de acesso
2. **Produto**: Itens gerenciados no estoque
3. **Categoria**: Classificação dos produtos
4. **Fornecedor**: Empresas que fornecem produtos
5. **Deposito**: Locais físicos onde os produtos são armazenados
6. **Estoque**: Controle de quantidade de produtos por depósito
7. **Compra**: Registro de aquisições de produtos
8. **ItemCompra**: Itens individuais de uma compra
9. **Venda**: Registro de saídas de produtos
10. **ItemVenda**: Itens individuais de uma venda

## Relacionamentos

- Um-para-muitos: Categoria para Produtos
- Muitos-para-muitos: Produtos para Fornecedores
- Um-para-um: Usuário para Perfil (se implementado)
- Muitos-para-um: Itens de Estoque para Depósito

## Cronograma

- **17/05**: Definição do projeto e configuração inicial
- **24/05**: 2º Status Report: Enviar um email informando o andamento atual do projeto -
o que foi implementado, o que está em desenvolvimento e o que ainda será feito.
Enviar o link do repositório. Reportar o que cada componente tem trabalhado.
- **30/05**: Orientações de projeto - horário de aula usado para trabalhar no projeto.
Dúvidas com o professor.
- **31/05**: Apresentação do projeto

## Documentação da API

A documentação da API está disponível em `/documentacao` quando o servidor está em execução.
