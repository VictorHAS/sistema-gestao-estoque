import { FastifyRequest, FastifyReply } from 'fastify';
import { VendaService } from '../services/venda.service';
import { StatusPedido } from '../generated/prisma';

interface ParamsWithId {
  id: string;
}

interface CriarVendaBody {
  usuarioId: string;
  itens: {
    produtoId: string;
    depositoId: string;
    quantidade: number;
    precoUnitario: number;
  }[];
}


interface AtualizarStatusBody {
  status: StatusPedido;
}

export class VendaController {
  private vendaService = new VendaService();

  listarTodas = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const vendas = await this.vendaService.listarTodas();
      return reply.code(200).send(vendas);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao listar vendas' });
    }
  };

  obterPorId = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const venda = await this.vendaService.obterPorId(id);

      if (!venda) {
        return reply.code(404).send({ error: 'Venda não encontrada' });
      }

      return reply.code(200).send(venda);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao buscar venda' });
    }
  };

  criar = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body = request.body as CriarVendaBody;
      const novaVenda = await this.vendaService.criar(body);
      return reply.code(201).send(novaVenda);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao criar venda' });
    }
  };

  atualizarStatus = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params as ParamsWithId;
      const { status } = request.body as AtualizarStatusBody;
      const venda = await this.vendaService.atualizarStatus(id, { status });
      return reply.code(200).send(venda);
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Venda não encontrada') {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao atualizar status da venda' });
    }
  };

  excluir = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params as ParamsWithId;
      await this.vendaService.excluir(id);
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Venda não encontrada') {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao excluir venda' });
    }
  };
}
