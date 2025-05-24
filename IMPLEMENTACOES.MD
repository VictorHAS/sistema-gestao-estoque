# IMPLEMENTAÇÕES

## Organização das Tarefas

Cada membro será responsável por até 2 services e 2 controllers, além de funcionalidades específicas para garantir o mínimo de 10 funcionalidades implementadas no projeto.

---

## Membro 1: Victor Hermes
### Services/Controllers
- [ ] Usuário (service e controller)
- [ ] Categoria (service e controller)

### Setup e Configuração Inicial
- [x] Setup inicial do projeto backend
- [x] Configuração do Fastify
- [x] Configuração do JWT para autenticação
- [x] Setup do Prisma (instalação, configuração, integração)
- [x] Criação das rotas iniciais
- [x] Definição dos types globais

### Funcionalidades
- [x] Implementar autenticação JWT
- [x] Implementar cadastro e login de usuários
- [x] Implementar níveis de acesso (admin, gerente, funcionário)
- [x] Documentar endpoints de autenticação e usuários no Swagger
- [ ] Implementar CRUD de categorias
- [ ] Implementar busca de categorias por nome

---

## Membro 2: [Sara Souza]
### Services/Controllers
- [ ] Produto (service e controller)
- [ ] Fornecedor (service e controller)

### Funcionalidades
- [ ] Implementar CRUD de produtos e fornecedores
- [ ] Implementar busca de produtos por nome/código
- [ ] Implementar associação de produtos a fornecedores
- [ ] Implementar validações e middlewares para produtos e fornecedores
- [ ] Implementar queries personalizadas para produtos (ex: busca por múltiplos filtros, produtos sem estoque, produtos mais vendidos, etc.)
- [ ] Implementar queries personalizadas para fornecedores (ex: fornecedores por produto, fornecedores com mais produtos, etc.)

---

## Membro 3: [Thiago Farias]
### Services/Controllers
- [x] Compra (service e controller)
- [ ] ItemCompra (service e controller)
- [ ] Deposito (service e controller)

### Funcionalidades
- [ ] Implementar registro de compras e itens de compra
- [ ] Atualizar estoque ao registrar compra
- [ ] Implementar relatório de movimentação de compras
- [ ] Implementar CRUD de depósitos
- [ ] Implementar movimentação de estoque entre depósitos

### Documentação
- [ ] Documentar endpoints de Compra, ItemCompra e Deposito na documentação da API

---

## Membro 4: [Alexandre Pontes]
### Services/Controllers
- [ ] Venda (service e controller)
- [ ] ItemVenda (service e controller)
- [ ] Estoque (service e controller)

### Funcionalidades
- [ ] Implementar registro de vendas e itens de venda
- [ ] Atualizar estoque ao registrar venda
- [ ] Implementar alerta de estoque baixo
- [ ] Implementar CRUD de estoque
- [ ] Integrar estoque com vendas e compras

### Tratamento de Erros e Logs
- [ ] Implementar tratamento de erros para rotas de Venda, ItemVenda e Estoque
- [ ] Adicionar logs relevantes para operações de venda e estoque

---
