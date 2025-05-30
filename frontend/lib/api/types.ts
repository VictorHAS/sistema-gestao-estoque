// ============================================================================
// TIPOS BÁSICOS
// ============================================================================

export enum Cargo {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  FUNCIONARIO = 'FUNCIONARIO'
}

export enum StatusPedido {
  PENDENTE = 'PENDENTE',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

export enum StatusCompra {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  RECEBIDO = 'RECEBIDO',
  CANCELADO = 'CANCELADO'
}

export enum StatusVenda {
  PAGA = 'PAGA',
  PENDENTE = 'PENDENTE',
  CANCELADA = 'CANCELADA'
}

export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  PIX = 'PIX',
  BOLETO = 'BOLETO'
}

// ============================================================================
// ENTIDADES
// ============================================================================

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  cargo: Cargo;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Categoria {
  id: string;
  nome: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  codigo: string;
  preco: number;
  categoriaId: string;
  dataCriacao: string;
  dataAtualizacao: string;
  categoria?: Categoria;
}

export interface Fornecedor {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  produtos?: Produto[];
}

// Tipo Supplier para compatibilidade com componentes que esperam esta interface
export interface Supplier {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  produtosAtivos: number;
  ultimaCompra?: string;
  status: 'ATIVO' | 'INATIVO';
}

export interface Deposito {
  id: string;
  nome: string;
  localizacao: string;
  criadoEm: string;
}

export interface Estoque {
  id: string;
  quantidade: number;
  produtoId: string;
  depositoId: string;
  dataCriacao: string;
  dataAtualizacao: string;
  produto?: Produto;
  deposito?: Deposito;
}

export interface Compra {
  id: string;
  dataCompra: string;
  quantidade: number;
  precoUnitario: number;
  valorTotal: number;
  status: StatusPedido;
  produtoId: string;
  fornecedorId: string;
  usuarioId: string;
  produto?: Produto;
  fornecedor?: Fornecedor;
  usuario?: Usuario;
}

export interface ItemVenda {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  produto?: Produto;
}

export interface Venda {
  id: string;
  dataVenda: string;
  valorTotal: number;
  status: StatusPedido;
  usuarioId: string;
  usuario?: Usuario;
  itens: ItemVenda[];
}

// Tipos específicos para páginas de vendas
export interface VendaType {
  id: string;
  clienteNome: string;
  clienteEmail?: string;
  clienteTelefone: string;
  itens: VendaItem[];
  total: number;
  formaPagamento: keyof typeof FormaPagamento;
  status: keyof typeof StatusVenda;
  dataVenda: string;
  vendedor: string;
  observacoes?: string;
}

export interface VendaItem {
  produtoId: string;
  produto?: string;
  codigo?: string;
  quantidade: number;
  precoUnitario: number;
}

export interface VendaFormData {
  clienteNome: string;
  clienteEmail?: string;
  clienteTelefone: string;
  itens: VendaItem[];
  formaPagamento: keyof typeof FormaPagamento;
  observacoes?: string;
}

// ============================================================================
// RESPONSES PADRONIZADAS
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  erro?: string;
}

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

export namespace Auth {
  // POST /api/auth/login
  export interface LoginRequest {
    email: string;
    senha: string;
  }

  export interface LoginResponse {
    token: string;
    usuario: Usuario;
  }

  // GET /api/auth/me
  export type MeResponse = Usuario;
}

// ============================================================================
// USUÁRIOS
// ============================================================================

export namespace Users {
  // GET /api/usuarios
  export interface ListQuery {
    nome?: string;
    cargo?: Cargo;
  }

  export type ListResponse = Usuario[];

  // GET /api/usuarios/:id
  export type GetByIdResponse = Usuario;

  // POST /api/usuarios
  export interface CreateRequest {
    email: string;
    senha: string;
    nome: string;
    cargo?: Cargo;
  }

  export type CreateResponse = Usuario;

  // PUT /api/usuarios/:id
  export interface UpdateRequest {
    email?: string;
    nome?: string;
    cargo?: Cargo;
  }

  export type UpdateResponse = Usuario;

  // PATCH /api/usuarios/:id/senha
  export interface UpdatePasswordRequest {
    senhaAtual: string;
    novaSenha: string;
  }

  export interface UpdatePasswordResponse {
    message: string;
  }

  // DELETE /api/usuarios/:id
  // No response body (204)
}

// ============================================================================
// CATEGORIAS
// ============================================================================

export namespace Categories {
  // GET /api/categorias
  export interface ListQuery {
    nome?: string;
  }

  export type ListResponse = Categoria[];

  // GET /api/categorias/:id
  export type GetByIdResponse = Categoria;

  // POST /api/categorias
  export interface CreateRequest {
    nome: string;
  }

  export type CreateResponse = Categoria;

  // PUT /api/categorias/:id
  export interface UpdateRequest {
    nome: string;
  }

  export type UpdateResponse = Categoria;

  // DELETE /api/categorias/:id
  // No response body (204)
}

// ============================================================================
// PRODUTOS
// ============================================================================

export namespace Products {
  // GET /api/produtos
  export type ListResponse = ApiResponse<Produto[]>;

  // GET /api/produtos/:id
  export type GetByIdResponse = ApiResponse<Produto>;

  // GET /api/produtos/buscar/:nome
  export type SearchByNameResponse = ApiResponse<Produto[]>;

  // POST /api/produtos
  export interface CreateRequest {
    nome: string;
    descricao?: string;
    codigo: string;
    preco: number;
    categoriaId: string;
  }

  export type CreateResponse = ApiResponse<Produto>;

  // PUT /api/produtos/:id
  export interface UpdateRequest {
    nome?: string;
    descricao?: string;
    codigo?: string;
    preco?: number;
    categoriaId?: string;
  }

  export type UpdateResponse = ApiResponse<Produto>;

  // DELETE /api/produtos/:id
  // No response body (204)
}

// ============================================================================
// FORNECEDORES
// ============================================================================

export namespace Suppliers {
  // GET /api/fornecedores
  export type ListResponse = ApiResponse<Fornecedor[]>;

  // GET /api/fornecedores/:id
  export type GetByIdResponse = ApiResponse<Fornecedor>;

  // POST /api/fornecedores
  export interface CreateRequest {
    nome: string;
    email: string;
    telefone?: string;
    endereco?: string;
  }

  export type CreateResponse = ApiResponse<Fornecedor>;

  // PUT /api/fornecedores/:id
  export interface UpdateRequest {
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
  }

  export type UpdateResponse = ApiResponse<Fornecedor>;

  // DELETE /api/fornecedores/:id
  // No response body (204)

  // POST /api/fornecedores/:fornecedorId/produtos/:produtoId
  export interface AddProductResponse {
    success: boolean;
    message: string;
  }

  // DELETE /api/fornecedores/:fornecedorId/produtos/:produtoId
  export interface RemoveProductResponse {
    success: boolean;
    message: string;
  }
}

// ============================================================================
// DEPÓSITOS
// ============================================================================

export namespace Warehouses {
  // GET /api/depositos
  export type ListResponse = Deposito[];

  // GET /api/depositos/:id
  export type GetByIdResponse = Deposito;

  // POST /api/depositos
  export interface CreateRequest {
    nome: string;
    localizacao: string;
  }

  export type CreateResponse = Deposito;

  // PUT /api/depositos/:id
  export interface UpdateRequest {
    nome?: string;
    localizacao?: string;
  }

  export type UpdateResponse = Deposito;

  // DELETE /api/depositos/:id
  // No response body (204)
}

// ============================================================================
// ESTOQUE
// ============================================================================

export namespace Stock {
  // GET /api/estoque
  export type ListResponse = Estoque[];

  // GET /api/estoque/:id
  export type GetByIdResponse = Estoque;

  // GET /api/estoque/produto/:produtoId/deposito/:depositoId
  export type GetByProductAndWarehouseResponse = Estoque;

  // POST /api/estoque
  export interface CreateRequest {
    produtoId: string;
    depositoId: string;
    quantidade: number;
  }

  export type CreateResponse = Estoque;

  // PUT /api/estoque/produto/:produtoId/deposito/:depositoId
  export interface UpdateQuantityRequest {
    quantidade: number;
  }

  export type UpdateQuantityResponse = Estoque;

  // PATCH /api/estoque/produto/:produtoId/deposito/:depositoId/adicionar
  export interface AddStockRequest {
    quantidade: number;
  }

  export type AddStockResponse = Estoque;

  // PATCH /api/estoque/produto/:produtoId/deposito/:depositoId/remover
  export interface RemoveStockRequest {
    quantidade: number;
  }

  export type RemoveStockResponse = Estoque;

  // GET /api/estoque/alerta-baixo?limite=10
  export interface LowStockQuery {
    limite?: number;
  }

  export type LowStockResponse = Estoque[];
}

// ============================================================================
// COMPRAS
// ============================================================================

export namespace Purchases {
  // GET /api/compras
  export type ListResponse = Compra[];

  // GET /api/compras/:id
  export type GetByIdResponse = Compra;

  // POST /api/compras
  export interface CreateRequest {
    produtoId: string;
    fornecedorId: string;
    quantidade: number;
  }

  export type CreateResponse = Compra;

  // PATCH /api/compras/:id/status
  export interface UpdateStatusRequest {
    status: StatusPedido;
  }

  export type UpdateStatusResponse = Compra;

  // DELETE /api/compras/:id
  // No response body (204)
}

// ============================================================================
// VENDAS
// ============================================================================

export namespace Sales {
  // GET /api/vendas
  export type ListResponse = Venda[];

  // GET /api/vendas/:id
  export type GetByIdResponse = Venda;

  // POST /api/vendas
  export interface CreateRequest {
    itens: {
      produtoId: string;
      depositoId: string;
      quantidade: number;
      precoUnitario: number;
    }[];
  }

  export type CreateResponse = Venda;

  // PATCH /api/vendas/:id/status
  export interface UpdateStatusRequest {
    status: StatusPedido;
  }

  export type UpdateStatusResponse = Venda;

  // DELETE /api/vendas/:id
  // No response body (204)
}

// ============================================================================
// ITENS DE VENDA
// ============================================================================

export namespace SaleItems {
  // GET /api/vendas/:vendaId/itens
  export type ListByVendaResponse = ItemVenda[];
}

// ============================================================================
// PERMISSÕES POR ENDPOINT
// ============================================================================

export const PERMISSIONS = {
  // Autenticação
  'POST /api/auth/login': ['PUBLIC'],
  'GET /api/auth/me': ['AUTHENTICATED'],

  // Usuários
  'GET /api/usuarios': ['ADMIN', 'GERENTE'],
  'GET /api/usuarios/:id': ['AUTHENTICATED'],
  'POST /api/usuarios': ['ADMIN'],
  'PUT /api/usuarios/:id': ['AUTHENTICATED'],
  'PATCH /api/usuarios/:id/senha': ['AUTHENTICATED'],
  'DELETE /api/usuarios/:id': ['ADMIN'],

  // Categorias
  'GET /api/categorias': ['AUTHENTICATED'],
  'GET /api/categorias/:id': ['AUTHENTICATED'],
  'POST /api/categorias': ['ADMIN', 'GERENTE'],
  'PUT /api/categorias/:id': ['ADMIN', 'GERENTE'],
  'DELETE /api/categorias/:id': ['ADMIN'],

  // Produtos
  'GET /api/produtos': ['AUTHENTICATED'],
  'GET /api/produtos/:id': ['AUTHENTICATED'],
  'GET /api/produtos/buscar/:nome': ['AUTHENTICATED'],
  'POST /api/produtos': ['ADMIN', 'GERENTE'],
  'PUT /api/produtos/:id': ['ADMIN', 'GERENTE'],
  'DELETE /api/produtos/:id': ['ADMIN'],

  // Fornecedores
  'GET /api/fornecedores': ['AUTHENTICATED'],
  'GET /api/fornecedores/:id': ['AUTHENTICATED'],
  'POST /api/fornecedores': ['ADMIN', 'GERENTE'],
  'PUT /api/fornecedores/:id': ['ADMIN', 'GERENTE'],
  'DELETE /api/fornecedores/:id': ['ADMIN'],
  'POST /api/fornecedores/:fornecedorId/produtos/:produtoId': ['ADMIN', 'GERENTE'],
  'DELETE /api/fornecedores/:fornecedorId/produtos/:produtoId': ['ADMIN', 'GERENTE'],

  // Depósitos
  'GET /api/depositos': ['AUTHENTICATED'],
  'GET /api/depositos/:id': ['AUTHENTICATED'],
  'POST /api/depositos': ['ADMIN', 'GERENTE'],
  'PUT /api/depositos/:id': ['ADMIN', 'GERENTE'],
  'DELETE /api/depositos/:id': ['ADMIN'],

  // Estoque
  'GET /api/estoque': ['AUTHENTICATED'],
  'GET /api/estoque/:id': ['AUTHENTICATED'],
  'GET /api/estoque/produto/:produtoId/deposito/:depositoId': ['AUTHENTICATED'],
  'POST /api/estoque': ['ADMIN', 'GERENTE'],
  'PUT /api/estoque/produto/:produtoId/deposito/:depositoId': ['ADMIN', 'GERENTE'],
  'PATCH /api/estoque/produto/:produtoId/deposito/:depositoId/adicionar': ['ADMIN', 'GERENTE', 'FUNCIONARIO'],
  'PATCH /api/estoque/produto/:produtoId/deposito/:depositoId/remover': ['ADMIN', 'GERENTE', 'FUNCIONARIO'],

  // Compras
  'GET /api/compras': ['AUTHENTICATED'],
  'GET /api/compras/:id': ['AUTHENTICATED'],
  'POST /api/compras': ['ADMIN', 'GERENTE'],
  'PATCH /api/compras/:id/status': ['ADMIN', 'GERENTE'],
  'DELETE /api/compras/:id': ['ADMIN'],

  // Vendas
  'GET /api/vendas': ['AUTHENTICATED'],
  'GET /api/vendas/:id': ['AUTHENTICATED'],
  'POST /api/vendas': ['AUTHENTICATED'],
  'PATCH /api/vendas/:id/status': ['ADMIN', 'GERENTE'],
  'DELETE /api/vendas/:id': ['ADMIN'],

  // Itens de Venda
  'GET /api/vendas/:vendaId/itens': ['AUTHENTICATED'],
} as const;

// ============================================================================
// HELPERS DE TIPAGEM
// ============================================================================

export type ApiEndpoint = keyof typeof PERMISSIONS;

export type EndpointPermission<T extends ApiEndpoint> = typeof PERMISSIONS[T][number];

// Helper para extrair tipos de parâmetros de URL
export type ExtractParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ExtractParams<Rest>
  : T extends `${string}:${infer Param}`
  ? { [K in Param]: string }
  : object;

// ============================================================================
// CONFIGURAÇÕES DA API
// ============================================================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// ============================================================================
// CÓDIGOS DE STATUS HTTP
// ============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
