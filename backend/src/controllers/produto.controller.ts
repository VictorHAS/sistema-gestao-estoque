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

const response = (success: boolean, message: string, data: any = null) => ({
  success,
  message,
  data,
});

export class ProdutoController {
  private produtoService = new ProdutoService();

  listarTodos = async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const produtos = await this.produtoService.listarTodos();
      reply.send(response(true, 'Lista de produtos', produtos));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao listar produtos'));
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
        return reply.status(404).send(response(false, 'Produto não encontrado'));
      }
      reply.send(response(true, 'Produto encontrado', produto));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao buscar produto'));
    }
  };

  buscarPorNome = async (
    request: FastifyRequest<{ Params: ParamsWithNome }>,
    reply: FastifyReply
  ) => {
    try {
      const { nome } = request.params;
      const produtos = await this.produtoService.buscarPorNome(nome);
      reply.send(response(true, 'Busca por nome realizada', produtos));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao buscar produtos por nome'));
    }
  };

  criar = async (
    request: FastifyRequest<{ Body: CriarProdutoBody }>,
    reply: FastifyReply
  ) => {
    try {
      const dados = request.body;
      const novoProduto = await this.produtoService.criar(dados);
      reply.status(201).send(response(true, 'Produto criado com sucesso', novoProduto));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao criar produto'));
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
        return reply.status(404).send(response(false, 'Produto não encontrado para atualização'));
      }
      reply.send(response(true, 'Produto atualizado com sucesso', atualizado));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao atualizar produto'));
    }
  };

  excluir = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const excluido = await this.produtoService.excluir(id);
      if (!excluido) {
        return reply.status(404).send(response(false, 'Produto não encontrado para exclusão'));
      }
      reply.status(204).send(); // No content
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao excluir produto'));
    }
  };
}
