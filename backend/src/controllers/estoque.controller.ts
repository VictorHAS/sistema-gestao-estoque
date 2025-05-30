import { FastifyRequest, FastifyReply } from 'fastify';
import { EstoqueService } from '../services/estoque.service';
import { successResponse, errorResponse } from '../utils/response.helper';

interface ParamsWithId {
  id: string;
}

interface EstoqueParams {
  produtoId: string;
  depositoId: string;
}

interface CriarEstoqueBody {
  produtoId: string;
  depositoId: string;
  quantidade: number;
}

interface QuantidadeBody {
  quantidade: number;
}

interface QueryLimite {
  limite?: string;
}

export class EstoqueController {
  private estoqueService = new EstoqueService();

  listarTodos = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const estoques = await this.estoqueService.listarTodos();
      return reply.code(200).send(successResponse('Lista de estoques obtida com sucesso', estoques));
    } catch (error) {
      reply.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao listar estoques'));
    }
  };

  obterPorId = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const estoque = await this.estoqueService.obterPorId(id);

      if (!estoque) {
        return reply.code(404).send(errorResponse('Estoque não encontrado'));
      }

      return reply.code(200).send(successResponse('Estoque obtido com sucesso', estoque));
    } catch (error) {
      reply.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao obter estoque por ID'));
    }
  };

  criar = async (
    request: FastifyRequest<{ Body: CriarEstoqueBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId, quantidade } = request.body;
      const novoEstoque = await this.estoqueService.criar({ produtoId, depositoId, quantidade });
      return reply.code(201).send(successResponse('Item de estoque criado com sucesso', novoEstoque));
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao criar item de estoque'));
    }
  };

  atualizarQuantidade = async (
    request: FastifyRequest<{ Params: EstoqueParams; Body: QuantidadeBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId } = request.params;
      const { quantidade } = request.body;

      const estoque = await this.estoqueService.atualizarQuantidade(produtoId, depositoId, quantidade);
      if (!estoque) {
        return reply.code(404).send(errorResponse('Estoque não encontrado'));
      }
      return reply.code(200).send(successResponse('Quantidade do estoque atualizada com sucesso', estoque));
    } catch (error) {
      reply.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao atualizar quantidade no estoque'));
    }
  };

  adicionarEstoque = async (
    request: FastifyRequest<{ Params: EstoqueParams; Body: QuantidadeBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId } = request.params;
      const { quantidade } = request.body;

      if (quantidade <= 0) {
        return reply.code(400).send(errorResponse('Quantidade inválida para adição'));
      }

      const estoqueAtualizado = await this.estoqueService.adicionarEstoque(produtoId, depositoId, quantidade);
      if (!estoqueAtualizado) {
        return reply.code(404).send(errorResponse('Estoque não encontrado'));
      }
      return reply.code(200).send(successResponse('Estoque adicionado com sucesso', estoqueAtualizado));
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao adicionar ao estoque'));
    }
  };

  remover = async (
    request: FastifyRequest<{ Params: EstoqueParams; Body: QuantidadeBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId } = request.params;
      const { quantidade } = request.body;

      if (!quantidade || quantidade <= 0) {
        return reply.code(400).send(errorResponse('Quantidade inválida para remoção'));
      }

      const estoqueAtualizado = await this.estoqueService.removerEstoque(produtoId, depositoId, quantidade);
      if (!estoqueAtualizado) {
        return reply.code(404).send(errorResponse('Estoque não encontrado'));
      }
      return reply.code(200).send(successResponse('Estoque removido com sucesso', estoqueAtualizado));
    } catch (error) {
      request.log.error(error);
      return reply.code(400).send(errorResponse((error as Error).message || 'Erro ao remover do estoque'));
    }
  };

  verificarEstoqueBaixo = async (
    request: FastifyRequest<{ Querystring: QueryLimite }>,
    reply: FastifyReply
  ) => {
    try {
      const limite = request.query?.limite ? Number(request.query.limite) : 10;

      if (isNaN(limite) || limite <= 0) {
        return reply.code(400).send(errorResponse('Limite inválido na query'));
      }

      const produtosBaixos = await this.estoqueService.listarProdutosComEstoqueBaixo(limite);
      return reply.code(200).send(successResponse('Produtos com estoque baixo obtidos com sucesso', produtosBaixos));
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao verificar estoque baixo'));
    }
  };

  obterPorProdutoEDeposito = async (
    request: FastifyRequest<{ Params: EstoqueParams }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId } = request.params;

      const estoque = await this.estoqueService.obterPorProdutoEDeposito(produtoId, depositoId);

      if (!estoque) {
        return reply.code(404).send(errorResponse('Estoque não encontrado para produto e depósito'));
      }

      return reply.code(200).send(successResponse('Estoque obtido com sucesso', estoque));
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao obter estoque por produto e depósito'));
    }
  };
}
