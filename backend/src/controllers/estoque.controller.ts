import { FastifyRequest, FastifyReply } from 'fastify';
import { EstoqueService } from '../services/estoque.service';

export class EstoqueController {
  private estoqueService = new EstoqueService();

  listarTodos = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const estoques = await this.estoqueService.listarTodos();
      return reply.code(200).send(estoques);
    } catch (error) {
      reply.log.error(error);
      return reply.code(500).send({ error: 'Erro ao listar estoques' });
    }
  };

  obterPorId = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const estoque = await this.estoqueService.obterPorId(id);

      if (!estoque) {
        return reply.code(404).send({ error: 'Estoque não encontrado' });
      }

      return reply.code(200).send(estoque);
    } catch (error) {
      reply.log.error(error);
      return reply.code(500).send({ error: 'Erro ao obter estoque por ID' });
    }
  };

  criar = async (
    request: FastifyRequest<{ Body: { produtoId: string; depositoId: string; quantidade: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId, quantidade } = request.body;
      const novoEstoque = await this.estoqueService.criar({ produtoId, depositoId, quantidade });
      return reply.code(201).send(novoEstoque);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao criar item de estoque.' });
    }
  };

  atualizarQuantidade = async (
    request: FastifyRequest<{ Params: { produtoId: string; depositoId: string }; Body: { quantidade: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId } = request.params;
      const { quantidade } = request.body;

      const estoque = await this.estoqueService.atualizarQuantidade(produtoId, depositoId, quantidade);
      return reply.code(200).send(estoque);
    } catch (error) {
      reply.log.error(error);
      return reply.code(500).send({ error: 'Erro ao atualizar quantidade no estoque' });
    }
  };

  adicionarEstoque = async (
    request: FastifyRequest<{ Params: { produtoId: string; depositoId: string }; Body: { quantidade: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId } = request.params;
      const { quantidade } = request.body;

      if (quantidade <= 0) {
        return reply.code(400).send({ error: 'Quantidade inválida para adição' });
      }

      const estoqueAtualizado = await this.estoqueService.adicionarEstoque(produtoId, depositoId, quantidade);
      return reply.code(200).send(estoqueAtualizado);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao adicionar ao estoque' });
    }
  };

  remover = async (
    request: FastifyRequest<{ Params: { produtoId: string; depositoId: string }; Body: { quantidade: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId } = request.params;
      const { quantidade } = request.body;

      if (!quantidade || quantidade <= 0) {
        return reply.code(400).send({ error: 'Quantidade inválida para remoção' });
      }

      const estoqueAtualizado = await this.estoqueService.removerEstoque(produtoId, depositoId, quantidade);
      return reply.code(200).send(estoqueAtualizado);
    } catch (error) {
      request.log.error(error);
      return reply.code(400).send({ error: (error as Error).message || 'Erro ao remover do estoque' });
    }
  };

  verificarEstoqueBaixo = async (
    request: FastifyRequest<{ Querystring: { limite?: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const limite = request.query?.limite ? Number(request.query.limite) : 10;

      if (isNaN(limite) || limite <= 0) {
        return reply.code(400).send({ error: 'Limite inválido na query' });
      }

      const produtosBaixos = await this.estoqueService.listarProdutosComEstoqueBaixo(limite);
      return reply.code(200).send(produtosBaixos);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao verificar estoque baixo' });
    }
  };

  obterPorProdutoEDeposito = async (
    request: FastifyRequest<{ Params: { produtoId: string; depositoId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId } = request.params;

      const estoque = await this.estoqueService.obterPorProdutoEDeposito(produtoId, depositoId);

      if (!estoque) {
        return reply.code(404).send({ error: 'Estoque não encontrado para produto e depósito' });
      }

      return reply.code(200).send(estoque);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao obter estoque por produto e depósito' });
    }
  };
}
