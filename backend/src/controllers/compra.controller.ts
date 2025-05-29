import { FastifyRequest, FastifyReply } from 'fastify';
import { CompraService, CriarCompraDTO } from '../services/compra.service';
import { StatusPedido } from '../generated/prisma';

const compraService = new CompraService();

export class CompraController {
  async listarTodas(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const compras = await compraService.listarTodas();
      reply.send(compras);
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao listar compras',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }

  async obterPorId(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;

    try {
      const compra = await compraService.obterPorId(id);
      if (!compra) {
        reply.status(404).send({ mensagem: 'Compra não encontrada' });
        return;
      }
      reply.send(compra);
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao obter compra',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }

  async criar(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as CriarCompraDTO;

      const compra = await compraService.criar(body);
      reply.status(201).send(compra);
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao criar compra',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }

  async atualizarStatus(
    request: FastifyRequest<{ Params: { id: string }; Body: { status: StatusPedido } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const { status } = request.body;

    if (!Object.values(StatusPedido).includes(status)) {
      reply.status(400).send({ mensagem: 'Status inválido' });
      return;
    }

    try {
      const compraAtualizada = await compraService.atualizarStatus(id, { status });
      reply.send(compraAtualizada);
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao atualizar status da compra',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }

  async excluir(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;

    try {
      await compraService.excluir(id);
      reply.status(204).send();
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao excluir compra',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }
}
