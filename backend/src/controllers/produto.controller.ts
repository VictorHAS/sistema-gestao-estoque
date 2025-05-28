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

  listarTodos = async (_request: FastifyRequest, reply: FastifyReply) => {
    const produtos = await this.produtoService.listarTodos();
    reply.send(produtos);
  };

  obterPorId = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const produto = await this.produtoService.obterPorId(id);
    if (produto) {
      reply.send(produto);
    } else {
      reply.status(404).send({ message: 'Produto não encontrado' });
    }
  };

  buscarPorNome = async (
    request: FastifyRequest<{ Params: ParamsWithNome }>,
    reply: FastifyReply
  ) => {
    const { nome } = request.params;
    const produtos = await this.produtoService.buscarPorNome(nome);
    reply.send(produtos);
  };

  criar = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const dados = request.body as CriarProdutoBody;
    const novoProduto = await this.produtoService.criar(dados);
    reply.status(201).send(novoProduto);
  };

  atualizar = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as ParamsWithId;
    const dados = request.body as AtualizarProdutoBody;

    const atualizado = await this.produtoService.atualizar(id, dados);
    if (atualizado) {
      reply.send(atualizado);
    } else {
      reply.status(404).send({ message: 'Produto não encontrado para atualização' });
    }
  };

  excluir = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as ParamsWithId;
    const excluido = await this.produtoService.excluir(id);
    if (excluido) {
      reply.status(204).send();
    } else {
      reply.status(404).send({ message: 'Produto não encontrado para exclusão' });
    }
  };
}