import { FastifyRequest, FastifyReply } from 'fastify';
import { FornecedorService } from '../services/fornecedor.service';

interface ParamsWithId {
  id: string;
}

interface ProdutoFornecedorParams {
  fornecedorId: string;
  produtoId: string;
}

interface CriarFornecedorBody {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
}

interface AtualizarFornecedorBody {
  nome?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export class FornecedorController {
  private fornecedorService: FornecedorService;

  constructor() {
    this.fornecedorService = new FornecedorService();
  }

  listarTodos = async (request: FastifyRequest, reply: FastifyReply) => {
    // Implementar
  };

  obterPorId = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    // Implementar
  };

  criar = async (
    request: FastifyRequest<{ Body: CriarFornecedorBody }>,
    reply: FastifyReply
  ) => {
    // Implementar
  };

  atualizar = async (
    request: FastifyRequest<{ Params: ParamsWithId; Body: AtualizarFornecedorBody }>,
    reply: FastifyReply
  ) => {
    // Implementar
  };

  excluir = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    // Implementar
  };

  adicionarProduto = async (
    request: FastifyRequest<{ Params: ProdutoFornecedorParams }>,
    reply: FastifyReply
  ) => {
    // Implementar
  };

  removerProduto = async (
    request: FastifyRequest<{ Params: ProdutoFornecedorParams }>,
    reply: FastifyReply
  ) => {
    // Implementar
  };
}
