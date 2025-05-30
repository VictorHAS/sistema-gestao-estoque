import { FastifyRequest, FastifyReply } from 'fastify';
import { CompraService, CriarCompraDTO } from '../services/compra.service';
import { StatusPedido } from '../generated/prisma';
import { successResponse, errorResponse } from '../utils/response.helper';

interface ParamsWithId {
  id: string;
}

interface AtualizarStatusBody {
  status: StatusPedido;
}

const compraService = new CompraService();

export class CompraController {
  async listarTodas(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const compras = await compraService.listarTodas();
      reply.send(successResponse('Lista de compras obtida com sucesso', compras));
    } catch (error: any) {
      request.log.error(error);
      reply.status(500).send(errorResponse('Erro ao listar compras'));
    }
  }

  async obterPorId(
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;

    try {
      const compra = await compraService.obterPorId(id);
      if (!compra) {
        reply.status(404).send(errorResponse('Compra não encontrada'));
        return;
      }
      reply.send(successResponse('Compra obtida com sucesso', compra));
    } catch (error: any) {
      request.log.error(error);
      reply.status(500).send(errorResponse('Erro ao obter compra'));
    }
  }

  async criar(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as CriarCompraDTO;

      const compra = await compraService.criar(body);
      reply.status(201).send(successResponse('Compra criada com sucesso', compra));
    } catch (error: any) {
      request.log.error(error);
      reply.status(500).send(errorResponse('Erro ao criar compra'));
    }
  }

  async atualizarStatus(
    request: FastifyRequest<{ Params: ParamsWithId; Body: AtualizarStatusBody }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const { status } = request.body;

    if (!Object.values(StatusPedido).includes(status)) {
      reply.status(400).send(errorResponse('Status inválido'));
      return;
    }

    try {
      const compraAtualizada = await compraService.atualizarStatus(id, { status });
      if (!compraAtualizada) {
        reply.status(404).send(errorResponse('Compra não encontrada'));
        return;
      }
      reply.send(successResponse('Status da compra atualizado com sucesso', compraAtualizada));
    } catch (error: any) {
      request.log.error(error);
      reply.status(500).send(errorResponse('Erro ao atualizar status da compra'));
    }
  }

  async excluir(
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;

    try {
      await compraService.excluir(id);
      reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Compra não encontrada') {
        reply.status(404).send(errorResponse('Compra não encontrada'));
        return;
      }
      reply.status(500).send(errorResponse('Erro ao excluir compra'));
    }
  }
}
