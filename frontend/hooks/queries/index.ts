// Hooks de consulta - exportação centralizada

// Autenticação
export {
  useCurrentUser,
  useLogin,
  useLogout,
  authQueryKeys,
} from './useAuth'

// Usuários
export {
  useUsuarios,
  useUsuario,
  useCreateUsuario,
  useUpdateUsuario,
  useUpdateSenhaUsuario,
  useDeleteUsuario,
  usuariosQueryKeys,
} from './useUsuarios'

// Categorias
export {
  useCategorias,
  useCategoria,
  useCreateCategoria,
  useUpdateCategoria,
  useDeleteCategoria,
  categoriasQueryKeys,
} from './useCategorias'

// Produtos
export {
  useProdutos,
  useProduto,
  useSearchProdutos,
  useCreateProduto,
  useUpdateProduto,
  useDeleteProduto,
  produtosQueryKeys,
} from './useProdutos'

// Fornecedores
export {
  useFornecedores,
  useFornecedor,
  useCreateFornecedor,
  useUpdateFornecedor,
  useDeleteFornecedor,
  fornecedoresQueryKeys,
} from './useFornecedores'

// Depósitos
export {
  useDepositos,
  useDeposito,
  useCreateDeposito,
  useUpdateDeposito,
  useDeleteDeposito,
  depositosQueryKeys,
} from './useDepositos'

// Estoque
export {
  useEstoque,
  useEstoqueItem,
  useEstoqueByProductAndWarehouse,
  useLowStockItems,
  useCreateEstoque,
  useUpdateQuantidadeEstoque,
  useAdicionarEstoque,
  useRemoverEstoque,
  estoqueQueryKeys,
} from './useEstoque'

// Compras
export {
  useCompras,
  useCompra,
  useCreateCompra,
  useUpdateCompra,
  useDeleteCompra,
  comprasQueryKeys,
} from './useCompras'

// Vendas
export {
  useVendas,
  useVenda,
  useVendaItens,
  useCreateVenda,
  useUpdateVenda,
  useDeleteVenda,
  vendasQueryKeys,
} from './useVendas'
