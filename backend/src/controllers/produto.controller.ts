import { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutoService } from '../services/produto.service';
import { successResponse, errorResponse } from '../utils/response.helper';

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
  fornecedorIds?: string[];
}

interface AtualizarProdutoBody {
  nome?: string;
  descricao?: string;
  codigo?: string;
  preco?: number;
  categoriaId?: string;
  fornecedorIds?: string[];
}

export class ProdutoController {
  private produtoService = new ProdutoService();

  listarTodos = async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const produtos = await this.produtoService.listarTodos();
      reply.send(successResponse('Lista de produtos', produtos));
    } catch (err) {
      reply.status(500).send(errorResponse('Erro ao listar produtos'));
    }
  };

  obterPorId = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const produto = await this.produtoService.obterPorId(id);
      if (!produto) {
        return reply.status(404).send(errorResponse('Produto não encontrado'));
      }
      reply.send(successResponse('Produto encontrado', produto));
    } catch (err) {
      reply.status(500).send(errorResponse('Erro ao buscar produto'));
    }
  };

  buscarPorNome = async (
    request: FastifyRequest<{ Params: ParamsWithNome }>,
    reply: FastifyReply
  ) => {
    try {
      const { nome } = request.params;
      const produtos = await this.produtoService.buscarPorNome(nome);
      reply.send(successResponse('Busca por nome realizada', produtos));
    } catch (err) {
      reply.status(500).send(errorResponse('Erro ao buscar produtos por nome'));
    }
  };

  criar = async (
    request: FastifyRequest<{ Body: CriarProdutoBody }>,
    reply: FastifyReply
  ) => {
    try {
      const dados = request.body;
      const novoProduto = await this.produtoService.criar(dados);
      reply.status(201).send(successResponse('Produto criado com sucesso', novoProduto));
    } catch (err) {
      reply.status(500).send(errorResponse('Erro ao criar produto'));
    }
  };

  atualizar = async (
    request: FastifyRequest<{ Params: ParamsWithId; Body: AtualizarProdutoBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const dados = request.body;
      const atualizado = await this.produtoService.atualizar(id, dados);
      if (!atualizado) {
        return reply.status(404).send(errorResponse('Produto não encontrado para atualização'));
      }
      reply.send(successResponse('Produto atualizado com sucesso', atualizado));
    } catch (err) {
      reply.status(500).send(errorResponse('Erro ao atualizar produto'));
    }
  };

  excluir = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      await this.produtoService.excluir(id);
      reply.status(204).send();
    } catch (err) {
      if (err instanceof Error && err.message === 'Produto não encontrado') {
        return reply.status(404).send(errorResponse('Produto não encontrado'));
      }
      reply.status(500).send(errorResponse('Erro ao excluir produto'));
    }
  };
}
