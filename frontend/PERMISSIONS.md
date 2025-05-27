# Sistema de Permissões

Este documento descreve como funciona o sistema de permissões baseado em funções (RBAC) implementado no frontend.

## Visão Geral

O sistema implementa controle de acesso baseado em funções seguindo as regras definidas no backend (Prisma + Fastify). Cada usuário possui um dos três cargos:

- **ADMIN**: Acesso total ao sistema
- **GERENTE**: Acesso a maioria das operações, exceto gerenciamento de usuários
- **FUNCIONARIO**: Acesso limitado a operações básicas

## Estrutura do Sistema

### 1. Definição de Permissões (`lib/permissions.ts`)

```typescript
export type UserRole = "ADMIN" | "GERENTE" | "FUNCIONARIO"
export type Permission = "usuarios:read" | "produtos:create" | ...
```

### 2. Hook de Permissões (`hooks/use-permissions.ts`)

```typescript
const { can, hasPermission, isAdmin } = usePermissions()
```

### 3. Componente Guard (`components/permission-guard.tsx`)

```typescript
<PermissionGuard permission="produtos:create">
  <Button>Criar Produto</Button>
</PermissionGuard>
```

## Uso Prático

### Proteger Botões e Ações

```tsx
import { PermissionGuard } from "@/components/permission-guard"

// Mostrar botão apenas para usuários com permissão
<PermissionGuard permission="produtos:create">
  <Button>Novo Produto</Button>
</PermissionGuard>

// Múltiplas permissões (qualquer uma)
<PermissionGuard permissions={["produtos:update", "produtos:delete"]}>
  <Button>Editar/Excluir</Button>
</PermissionGuard>

// Múltiplas permissões (todas obrigatórias)
<PermissionGuard permissions={["usuarios:read", "usuarios:update"]} requireAll>
  <AdminPanel />
</PermissionGuard>

// Por cargo específico
<PermissionGuard role="ADMIN">
  <AdminOnlyContent />
</PermissionGuard>
```

### Usando o Hook

```tsx
import { usePermissions } from "@/hooks/use-permissions"

function ProductPage() {
  const { can, hasPermission, isAdmin } = usePermissions()

  return (
    <div>
      {can.createProducts && <CreateButton />}
      {hasPermission("produtos:delete") && <DeleteButton />}
      {isAdmin && <AdminControls />}
    </div>
  )
}
```

## Mapeamento de Permissões

### ADMIN
- ✅ Todas as operações
- ✅ Gerenciar usuários
- ✅ Excluir qualquer registro
- ✅ Visualizar relatórios

### GERENTE
- ✅ Criar/editar produtos, categorias, fornecedores
- ✅ Gerenciar estoque e depósitos
- ✅ Atualizar status de compras/vendas
- ✅ Visualizar relatórios
- ❌ Gerenciar usuários
- ❌ Excluir registros

### FUNCIONARIO
- ✅ Visualizar todos os dados
- ✅ Criar compras e vendas
- ✅ Ajustar estoque
- ✅ Atualizar própria senha
- ❌ Criar/editar produtos
- ❌ Gerenciar usuários
- ❌ Visualizar relatórios

## Exemplos de Implementação

### Sidebar com Filtro de Menu
```tsx
const filteredMenuItems = menuItems.filter(item => {
  if (!item.permission) return true
  return hasPermission(item.permission)
})
```

### Dropdown com Ações Condicionais
```tsx
<DropdownMenuContent>
  <DropdownMenuItem>Visualizar</DropdownMenuItem>

  <PermissionGuard permission="produtos:update">
    <DropdownMenuItem>Editar</DropdownMenuItem>
  </PermissionGuard>

  <PermissionGuard permission="produtos:delete">
    <DropdownMenuItem className="text-destructive">
      Excluir
    </DropdownMenuItem>
  </PermissionGuard>
</DropdownMenuContent>
```

### Formulários com Campos Condicionais
```tsx
<Form>
  <Input name="nome" />
  <Input name="preco" />

  <PermissionGuard permission="produtos:update">
    <Select name="categoria" />
  </PermissionGuard>

  <PermissionGuard role="ADMIN">
    <Input name="codigoInterno" />
  </PermissionGuard>
</Form>
```

## Integração com Backend

O sistema frontend espelha as permissões definidas nas rotas do backend:

```typescript
// Backend: apenas ADMIN e GERENTE podem criar produtos
fastify.post('/', {
  preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
  // ...
})

// Frontend: mesmo controle
<PermissionGuard permission="produtos:create">
  <CreateProductButton />
</PermissionGuard>
```

## Debuging e Desenvolvimento

### Visualizar Permissões Atuais
```tsx
import { demonstratePermissions } from "@/lib/demo-permissions"

// No console do navegador
demonstratePermissions()
```

### Cards de Debug (apenas para ADMIN)
```tsx
<PermissionGuard role="ADMIN">
  <Card className="border-dashed">
    <CardContent>
      <div>Criar: {can.createProducts ? "✅" : "❌"}</div>
      <div>Editar: {can.editProducts ? "✅" : "❌"}</div>
      <div>Excluir: {can.deleteProducts ? "✅" : "❌"}</div>
    </CardContent>
  </Card>
</PermissionGuard>
```

## Boas Práticas

1. **Sempre usar PermissionGuard** para elementos de UI
2. **Verificar permissões no hook** para lógica condicional
3. **Manter consistência** com as regras do backend
4. **Testar com diferentes usuários** durante desenvolvimento
5. **Documentar novas permissões** quando adicionadas

## Usuários de Teste

Para testar o sistema, use os seguintes usuários (senha: `123456`):

- **admin@sistema.com** (ADMIN) - Acesso total
- **maria@sistema.com** (GERENTE) - Gerenciamento sem usuários
- **joao@sistema.com** (FUNCIONARIO) - Operações básicas

## Extensão do Sistema

Para adicionar novas permissões:

1. Adicione a permissão em `Permission` type
2. Atualize o `ROLE_PERMISSIONS` mapping
3. Adicione helper function em `can` object
4. Documente a nova permissão
5. Teste com todos os tipos de usuário
