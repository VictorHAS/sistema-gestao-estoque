import { FastifyRequest, FastifyReply } from 'fastify';
import { ItemVendaService } from '../services/itemVenda.service';

interface ParamsWithVendaId {
  vendaId: string;
}

interface ParamsWithId {
  id: string;
}

export class ItemController {
  private itemVendaService: ItemVendaService;

  constructor() {
    this.itemVendaService = new ItemVendaService();
  }

  listarPorVenda = async (
    request: FastifyRequest<{ Params: ParamsWithVendaId }>,
    reply: FastifyReply
  ) => {
    try {
      const { vendaId } = request.params;
      const itens = await this.itemVendaService.listarPorVenda(vendaId);
      return reply.code(200).send(itens);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao listar itens da venda' });
    }
  };

  }
