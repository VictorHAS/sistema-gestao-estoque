# API Types Reference

Este arquivo contém todos os tipos TypeScript para a API do sistema de gestão de estoque.

## Estrutura

### Entidades Básicas
- `Usuario`, `Categoria`, `Produto`, `Fornecedor`, `Deposito`, `Estoque`, `Compra`, `Venda`, `ItemVenda`
- Enums: `Cargo`, `StatusPedido`

### Namespaces por Módulo
Cada módulo da API tem seu próprio namespace com tipos específicos:

- `Auth` - Autenticação
- `Users` - Usuários
- `Categories` - Categorias
- `Products` - Produtos
- `Suppliers` - Fornecedores
- `Warehouses` - Depósitos
- `Stock` - Estoque
- `Purchases` - Compras
- `Sales` - Vendas
- `SaleItems` - Itens de Venda

### Exemplo de Uso

```typescript
import { Products, Categories, Auth } from '@/lib/api/types';

// Criar produto
const createProduct = async (data: Products.CreateRequest): Promise<Products.CreateResponse> => {
  const response = await fetch('/api/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Login
const login = async (credentials: Auth.LoginRequest): Promise<Auth.LoginResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
};
```

### Permissões
O objeto `PERMISSIONS` mapeia cada endpoint com suas permissões necessárias:

```typescript
import { PERMISSIONS } from '@/lib/api/types';

// Verificar se endpoint requer ADMIN
const isAdminRequired = PERMISSIONS['DELETE /api/produtos/:id'].includes('ADMIN'); // true
```

### Configurações
- `API_CONFIG` - URL base e configurações da API
- `HTTP_STATUS` - Códigos de status HTTP padronizados

## Endpoints Disponíveis

### Autenticação
- `POST /api/auth/login` - Login (público)
- `GET /api/auth/me` - Obter usuário atual (autenticado)

### Usuários
- `GET /api/usuarios` - Listar usuários (ADMIN, GERENTE)
- `GET /api/usuarios/:id` - Obter usuário (autenticado)
- `POST /api/usuarios` - Criar usuário (ADMIN)
- `PUT /api/usuarios/:id` - Atualizar usuário (autenticado)
- `PATCH /api/usuarios/:id/senha` - Atualizar senha (autenticado)
- `DELETE /api/usuarios/:id` - Excluir usuário (ADMIN)

### Categorias
- `GET /api/categorias` - Listar categorias (autenticado)
- `GET /api/categorias/:id` - Obter categoria (autenticado)
- `POST /api/categorias` - Criar categoria (ADMIN, GERENTE)
- `PUT /api/categorias/:id` - Atualizar categoria (ADMIN, GERENTE)
- `DELETE /api/categorias/:id` - Excluir categoria (ADMIN)

### Produtos
- `GET /api/produtos` - Listar produtos (autenticado)
- `GET /api/produtos/:id` - Obter produto (autenticado)
- `GET /api/produtos/buscar/:nome` - Buscar por nome (autenticado)
- `POST /api/produtos` - Criar produto (ADMIN, GERENTE)
- `PUT /api/produtos/:id` - Atualizar produto (ADMIN, GERENTE)
- `DELETE /api/produtos/:id` - Excluir produto (ADMIN)

### Fornecedores
- `GET /api/fornecedores` - Listar fornecedores (autenticado)
- `GET /api/fornecedores/:id` - Obter fornecedor (autenticado)
- `POST /api/fornecedores` - Criar fornecedor (ADMIN, GERENTE)
- `PUT /api/fornecedores/:id` - Atualizar fornecedor (ADMIN, GERENTE)
- `DELETE /api/fornecedores/:id` - Excluir fornecedor (ADMIN)
- `POST /api/fornecedores/:fornecedorId/produtos/:produtoId` - Adicionar produto (ADMIN, GERENTE)
- `DELETE /api/fornecedores/:fornecedorId/produtos/:produtoId` - Remover produto (ADMIN, GERENTE)

### Depósitos
- `GET /api/depositos` - Listar depósitos (autenticado)
- `GET /api/depositos/:id` - Obter depósito (autenticado)
- `POST /api/depositos` - Criar depósito (ADMIN, GERENTE)
- `PUT /api/depositos/:id` - Atualizar depósito (ADMIN, GERENTE)
- `DELETE /api/depositos/:id` - Excluir depósito (ADMIN)

### Estoque
- `GET /api/estoque` - Listar estoque (autenticado)
- `GET /api/estoque/:id` - Obter item de estoque (autenticado)
- `GET /api/estoque/produto/:produtoId/deposito/:depositoId` - Obter por produto/depósito (autenticado)
- `POST /api/estoque` - Criar item de estoque (ADMIN, GERENTE)
- `PUT /api/estoque/produto/:produtoId/deposito/:depositoId` - Atualizar quantidade (ADMIN, GERENTE)
- `PATCH /api/estoque/produto/:produtoId/deposito/:depositoId/adicionar` - Adicionar estoque (ADMIN, GERENTE, FUNCIONARIO)
- `PATCH /api/estoque/produto/:produtoId/deposito/:depositoId/remover` - Remover estoque (ADMIN, GERENTE, FUNCIONARIO)

### Compras
- `GET /api/compras` - Listar compras (autenticado)
- `GET /api/compras/:id` - Obter compra (autenticado)
- `POST /api/compras` - Criar compra (ADMIN, GERENTE)
- `PATCH /api/compras/:id/status` - Atualizar status (ADMIN, GERENTE)
- `DELETE /api/compras/:id` - Excluir compra (ADMIN)

### Vendas
- `GET /api/vendas` - Listar vendas (autenticado)
- `GET /api/vendas/:id` - Obter venda (autenticado)
- `POST /api/vendas` - Criar venda (autenticado)
- `PATCH /api/vendas/:id/status` - Atualizar status (ADMIN, GERENTE)
- `DELETE /api/vendas/:id` - Excluir venda (ADMIN)

### Itens de Venda
- `GET /api/vendas/:vendaId/itens` - Listar itens de uma venda (autenticado)

## Notas Importantes

1. **Autenticação**: Todos os endpoints (exceto login) requerem token JWT no header `Authorization: Bearer <token>`

2. **Permissões**: Verifique as permissões necessárias antes de fazer chamadas à API

3. **Responses**: Alguns endpoints retornam dados diretamente, outros usam o wrapper `ApiResponse<T>`

4. **Status Codes**: Use os códigos em `HTTP_STATUS` para verificar respostas

5. **Parâmetros**: URLs com `:id`, `:produtoId`, etc. devem ter os parâmetros substituídos pelos valores reais
