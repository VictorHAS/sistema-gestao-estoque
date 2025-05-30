import { API_CONFIG, HTTP_STATUS, type Usuario, type Categoria, type Produto, type Fornecedor, type Deposito, type Estoque, type Compra, type Venda, type ApiResponse, type StatusPedido } from './types';

// ============================================================================
// CONFIGURAÇÃO DO CLIENTE API
// ============================================================================

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      ...API_CONFIG.HEADERS,
    };
  }

  // Método para definir token de autenticação
  setAuthToken(token: string) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  // Método para remover token de autenticação
  clearAuthToken() {
    delete this.defaultHeaders.Authorization;
  }

  // Método base para fazer requisições
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Verificar se há token no localStorage e configurar se necessário
    if (typeof window !== 'undefined' && !this.defaultHeaders.Authorization) {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        this.setAuthToken(storedToken);
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Para códigos 204 (No Content), retorna sucesso sem body
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        // Adicionar status do erro para melhor handling
        const error = new Error(data.message || data.error || 'Erro na requisição') as Error & { status?: number };
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Métodos HTTP específicos
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// ============================================================================
// INSTÂNCIA GLOBAL DO CLIENTE
// ============================================================================

export const apiClient = new ApiClient();

// ============================================================================
// HELPERS PARA ENDPOINTS TIPADOS
// ============================================================================

// Helper para construir URLs com parâmetros
export const buildUrl = (template: string, params: Record<string, string>): string => {
  return Object.entries(params).reduce(
    (url, [key, value]) => url.replace(`:${key}`, value),
    template
  );
};

// Helper para construir query strings
export const buildQueryString = (params: Record<string, string | number | boolean>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// ============================================================================
// FUNÇÕES DE API TIPADAS
// ============================================================================

export const api = {
  // Autenticação
  auth: {
    login: (data: { email: string; senha: string }) =>
      apiClient.post<{ data: { token: string; usuario: Usuario } }>('/auth/login', data),

    getMe: () =>
      apiClient.get<{data:Usuario}>('/auth/me'),
  },

  // Usuários
  users: {
    list: (query?: { nome?: string; cargo?: string }) => {
      const queryString = query ? buildQueryString(query) : '';
      return apiClient.get<ApiResponse<Usuario[]>>(`/usuarios${queryString}`);
    },

    getById: (id: string) =>
      apiClient.get<ApiResponse<Usuario>>(`/usuarios/${id}`),

    create: (data: { email: string; senha: string; nome: string; cargo?: string }) =>
      apiClient.post<ApiResponse<Usuario>>('/usuarios', data),

    update: (id: string, data: { email?: string; nome?: string; cargo?: string }) =>
      apiClient.put<ApiResponse<Usuario>>(`/usuarios/${id}`, data),

    updatePassword: (id: string, data: { senhaAtual: string; novaSenha: string }) =>
      apiClient.patch<{ success: boolean; message: string }>(`/usuarios/${id}/senha`, data),

    delete: (id: string) =>
      apiClient.delete<void>(`/usuarios/${id}`),
  },

  // Categorias
  categories: {
    list: (query?: { nome?: string }) => {
      const queryString = query ? buildQueryString(query) : '';
      return apiClient.get<ApiResponse<Categoria[]>>(`/categorias${queryString}`);
    },

    getById: (id: string) =>
      apiClient.get<ApiResponse<Categoria>>(`/categorias/${id}`),

    create: (data: { nome: string }) =>
      apiClient.post<ApiResponse<Categoria>>('/categorias', data),

    update: (id: string, data: { nome: string }) =>
      apiClient.put<ApiResponse<Categoria>>(`/categorias/${id}`, data),

    delete: (id: string) =>
      apiClient.delete<void>(`/categorias/${id}`),
  },

  // Produtos
  products: {
    list: () =>
      apiClient.get<ApiResponse<Produto[]>>('/produtos'),

    getById: (id: string) =>
      apiClient.get<ApiResponse<Produto>>(`/produtos/${id}`),

    searchByName: (nome: string) =>
      apiClient.get<ApiResponse<Produto[]>>(`/produtos/buscar/${nome}`),

    create: (data: { nome: string; descricao?: string; codigo: string; preco: number; categoriaId: string }) =>
      apiClient.post<ApiResponse<Produto>>('/produtos', data),

    update: (id: string, data: { nome?: string; descricao?: string; codigo?: string; preco?: number; categoriaId?: string }) =>
      apiClient.put<ApiResponse<Produto>>(`/produtos/${id}`, data),

    delete: (id: string) =>
      apiClient.delete<void>(`/produtos/${id}`),
  },

  // Fornecedores
  suppliers: {
    list: () =>
      apiClient.get<ApiResponse<Fornecedor[]>>('/fornecedores'),

    getById: (id: string) =>
      apiClient.get<ApiResponse<Fornecedor>>(`/fornecedores/${id}`),

    create: (data: { nome: string; email: string; telefone?: string; endereco?: string }) =>
      apiClient.post<ApiResponse<Fornecedor>>('/fornecedores', data),

    update: (id: string, data: { nome?: string; email?: string; telefone?: string; endereco?: string }) =>
      apiClient.put<ApiResponse<Fornecedor>>(`/fornecedores/${id}`, data),

    delete: (id: string) =>
      apiClient.delete<void>(`/fornecedores/${id}`),

    addProduct: (fornecedorId: string, produtoId: string) =>
      apiClient.post<{ success: boolean; message: string }>(`/fornecedores/${fornecedorId}/produtos/${produtoId}`),

    removeProduct: (fornecedorId: string, produtoId: string) =>
      apiClient.delete<{ success: boolean; message: string }>(`/fornecedores/${fornecedorId}/produtos/${produtoId}`),
  },

  // Depósitos
  warehouses: {
    list: () =>
      apiClient.get<ApiResponse<Deposito[]>>('/depositos'),

    getById: (id: string) =>
      apiClient.get<ApiResponse<Deposito>>(`/depositos/${id}`),

    create: (data: { nome: string; localizacao: string }) =>
      apiClient.post<ApiResponse<Deposito>>('/depositos', data),

    update: (id: string, data: { nome?: string; localizacao?: string }) =>
      apiClient.put<ApiResponse<Deposito>>(`/depositos/${id}`, data),

    delete: (id: string) =>
      apiClient.delete<void>(`/depositos/${id}`),
  },

  // Estoque
  stock: {
    list: () =>
      apiClient.get<ApiResponse<Estoque[]>>('/estoque'),

    getById: (id: string) =>
      apiClient.get<ApiResponse<Estoque>>(`/estoque/${id}`),

    getByProductAndWarehouse: (produtoId: string, depositoId: string) =>
      apiClient.get<ApiResponse<Estoque>>(`/estoque/produto/${produtoId}/deposito/${depositoId}`),

    create: (data: { produtoId: string; depositoId: string; quantidade: number }) =>
      apiClient.post<ApiResponse<Estoque>>('/estoque', data),

    updateQuantity: (produtoId: string, depositoId: string, data: { quantidade: number }) =>
      apiClient.put<ApiResponse<Estoque>>(`/estoque/produto/${produtoId}/deposito/${depositoId}`, data),

    addStock: (produtoId: string, depositoId: string, data: { quantidade: number }) =>
      apiClient.patch<ApiResponse<Estoque>>(`/estoque/produto/${produtoId}/deposito/${depositoId}/adicionar`, data),

    removeStock: (produtoId: string, depositoId: string, data: { quantidade: number }) =>
      apiClient.patch<ApiResponse<Estoque>>(`/estoque/produto/${produtoId}/deposito/${depositoId}/remover`, data),

    getLowStock: (limite?: number) => {
      const queryString = limite ? buildQueryString({ limite }) : '';
      return apiClient.get<ApiResponse<Estoque[]>>(`/estoque/alerta-baixo${queryString}`);
    },
  },

  // Compras
  purchases: {
    list: () =>
      apiClient.get<ApiResponse<Compra[]>>('/compras'),

    getById: (id: string) =>
      apiClient.get<ApiResponse<Compra>>(`/compras/${id}`),

    create: (data: { produtoId: string; fornecedorId: string; quantidade: number }) =>
      apiClient.post<ApiResponse<Compra>>('/compras', data),

    updateStatus: (id: string, data: { status: StatusPedido }) =>
      apiClient.patch<ApiResponse<Compra>>(`/compras/${id}/status`, data),

    delete: (id: string) =>
      apiClient.delete<void>(`/compras/${id}`),
  },

  // Vendas
  sales: {
    list: () =>
      apiClient.get<ApiResponse<Venda[]>>('/vendas'),

    getById: (id: string) =>
      apiClient.get<ApiResponse<Venda>>(`/vendas/${id}`),

    create: (data: {
      itens: {
        produtoId: string;
        depositoId: string;
        quantidade: number;
        precoUnitario: number;
      }[]
    }) =>
      apiClient.post<ApiResponse<Venda>>('/vendas', data),

    updateStatus: (id: string, data: { status: StatusPedido }) =>
      apiClient.patch<ApiResponse<Venda>>(`/vendas/${id}/status`, data),

    delete: (id: string) =>
      apiClient.delete<void>(`/vendas/${id}`),

    getItems: (vendaId: string) =>
      apiClient.get<ApiResponse<Venda[]>>(`/vendas/${vendaId}/itens`),
  },
};

export default api;
