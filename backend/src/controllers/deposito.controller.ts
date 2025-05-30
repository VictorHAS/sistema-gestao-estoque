import { FastifyRequest, FastifyReply } from 'fastify';
import { DepositoService, CriarDepositoDTO, AtualizarDepositoDTO } from '../services/deposito.service';
import { successResponse, errorResponse } from '../utils/response.helper';

interface ParamsWithId {
  id: string;
}

export class DepositoController {
  private readonly depositoService = new DepositoService();

  async listarTodos(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const depositos = await this.depositoService.listarTodos();
      reply.send(successResponse('Lista de depósitos obtida com sucesso', depositos));
    } catch (error: any) {
      request.log.error(error);
      reply.status(500).send(errorResponse('Erro ao listar depósitos'));
    }
  }

  async obterPorId(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;

    try {
      const deposito = await this.depositoService.obterPorId(id);
      if (!deposito) {
        reply.status(404).send(errorResponse('Depósito não encontrado'));
        return;
      }
      reply.send(successResponse('Depósito obtido com sucesso', deposito));
    } catch (error: any) {
      request.log.error(error);
      reply.status(500).send(errorResponse('Erro ao obter depósito'));
    }
  }

  async criar(request: FastifyRequest<{ Body: CriarDepositoDTO }>, reply: FastifyReply): Promise<void> {
    try {
      const novoDeposito = await this.depositoService.criar(request.body);
      reply.status(201).send(successResponse('Depósito criado com sucesso', novoDeposito));
    } catch (error: any) {
      request.log.error(error);
      reply.status(500).send(errorResponse('Erro ao criar depósito'));
    }
  }

  async atualizar(request: FastifyRequest<{ Params: ParamsWithId, Body: AtualizarDepositoDTO }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;

    try {
      const depositoAtualizado = await this.depositoService.atualizar(id, request.body);
      if (!depositoAtualizado) {
        reply.status(404).send(errorResponse('Depósito não encontrado para atualização'));
        return;
      }
      reply.send(successResponse('Depósito atualizado com sucesso', depositoAtualizado));
    } catch (error: any) {
      request.log.error(error);
      reply.status(500).send(errorResponse('Erro ao atualizar depósito'));
    }
  }

  async excluir(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;

    try {
      await this.depositoService.excluir(id);
      reply.status(204).send();
    } catch (error: any) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Depósito não encontrado') {
        reply.status(404).send(errorResponse('Depósito não encontrado'));
        return;
      }
      reply.status(500).send(errorResponse('Erro ao excluir depósito'));
    }
  }
}
