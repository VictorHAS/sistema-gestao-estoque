import { FastifyRequest, FastifyReply } from 'fastify';
import { RouteGenericInterface } from 'fastify';
import { EstoqueService } from '../services/estoque.service';
import { AdicionarEstoqueRoute } from '../routes/estoque.routes'; 
import { CriarEstoqueRoute } from '../routes/estoque.routes'; 

interface Params {
  produtoId: string;
  depositoId: string;
}

interface ParamsWithId {
  id: string;
}

interface AtualizarEstoqueBody {
  quantidade: number;
}

interface AtualizarEstoqueParams {
  produtoId: string;
  depositoId: string;
}

interface RemoverEstoqueParams {
  produtoId: string;
  depositoId: string;
}

interface RemoverEstoqueBody {
  quantidade: number;
}

interface EstoqueBaixoQuery {
  limite?: string; // opcional, string por vir da query
}


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
    request: FastifyRequest<{ Params: ParamsWithId }>,
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

  atualizarQuantidade = async (
    request: FastifyRequest<{ Params: AtualizarEstoqueParams; Body: AtualizarEstoqueBody }>,
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

  // Método REMOVER corrigido para usar Body no lugar de Querystring
  remover = async (
    request: FastifyRequest, // sem tipagem genérica explícita
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, depositoId } = request.params as RemoverEstoqueParams;
      const { quantidade } = request.body as RemoverEstoqueBody;

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
    request: FastifyRequest<{ Querystring: EstoqueBaixoQuery }>,
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
    request: FastifyRequest<{ Params: Params }>,
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


adicionarEstoque = async (
  request: FastifyRequest<AdicionarEstoqueRoute>,
  reply: FastifyReply
) => {
  try {
    const { produtoId, depositoId } = request.params;
    const { quantidade } = request.body;

    if (quantidade <= 0) {
      return reply.code(400).send({ error: 'Quantidade inválida para adição' });
    }

    const estoqueAtualizado = await this.estoqueService.adicionarEstoque(
      produtoId,
      depositoId,
      quantidade
    );
    return reply.code(200).send(estoqueAtualizado);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao adicionar ao estoque' });
  }
};


criar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // forçando o tipo do body aqui
    const { produtoId, depositoId, quantidade } = request.body as {
      produtoId: string;
      depositoId: string;
      quantidade: number;
    };

    const novoEstoque = await this.estoqueService.criar({
      produtoId,
      depositoId,
      quantidade,
    });

    return reply.code(201).send(novoEstoque);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao criar item de estoque.' });
  }
};









}
