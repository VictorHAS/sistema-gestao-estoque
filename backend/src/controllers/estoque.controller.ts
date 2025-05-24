import { FastifyRequest, FastifyReply } from 'fastify';
import { EstoqueService } from '../services/estoque.service';

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

  verificarEstoqueBaixo = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const produtosBaixos = await this.estoqueService.listarProdutosComEstoqueBaixo(10);
    return reply.code(200).send(produtosBaixos);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Erro ao verificar estoque baixo' });
  }
 };

}
