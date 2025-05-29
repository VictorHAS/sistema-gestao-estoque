import { FastifyRequest, FastifyReply } from 'fastify';
import { DepositoService, CriarDepositoDTO, AtualizarDepositoDTO } from '../services/deposito.service';

export class DepositoController {
  private readonly depositoService = new DepositoService();

  async listarTodos(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const depositos = await this.depositoService.listarTodos();
      reply.send(depositos);
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao listar depósitos',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }

  async obterPorId(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;

    try {
      const deposito = await this.depositoService.obterPorId(id);
      if (!deposito) {
        reply.status(404).send({ mensagem: 'Depósito não encontrado' });
        return;
      }
      reply.send(deposito);
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao obter depósito',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }

  async criar(request: FastifyRequest<{ Body: CriarDepositoDTO }>, reply: FastifyReply): Promise<void> {
    try {
      const novoDeposito = await this.depositoService.criar(request.body);
      reply.status(201).send(novoDeposito);
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao criar depósito',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }

  async atualizar(request: FastifyRequest<{ Params: { id: string }, Body: AtualizarDepositoDTO }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;

    try {
      const depositoAtualizado = await this.depositoService.atualizar(id, request.body);
      reply.send(depositoAtualizado);
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao atualizar depósito',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }

  async excluir(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;

    try {
      await this.depositoService.excluir(id);
      reply.status(204).send();
    } catch (error: any) {
      reply.status(500).send({
        mensagem: 'Erro ao excluir depósito',
        erro: error?.message || 'Erro desconhecido',
      });
    }
  }
}
