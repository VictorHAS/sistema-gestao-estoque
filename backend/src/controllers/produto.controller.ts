import { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutoService } from '../services/produto.service';

interface ParamsWithId {
  id: string;
}

interface ParamsWithNome {
  nome: string;
}

interface CriarProdutoBody {
  nome: string;
  descricao?: string;
  codigo: string;
  preco: number;
  categoriaId: string;
}

interface AtualizarProdutoBody {
  nome?: string;
  descricao?: string;
  codigo?: string;
  preco?: number;
  categoriaId?: string;
}

export class ProdutoController {
  private produtoService: ProdutoService;

  constructor() {
    this.produtoService = new ProdutoService();
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

  buscarPorNome = async (
    request: FastifyRequest<{ Params: ParamsWithNome }>,
    reply: FastifyReply
  ) => {
    // Implementar
  };

  criar = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    // Implementar
    const {  } = request.body as CriarProdutoBody;
  };

  atualizar = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    // Implementar
    const { id } = request.params as ParamsWithId;
    const { nome, descricao, codigo, preco, categoriaId } = request.body as AtualizarProdutoBody;
  };

  excluir = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    // Implementar
    const { id } = request.params as ParamsWithId;
  };
}
