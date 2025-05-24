import { FastifyRequest, FastifyReply } from 'fastify'
import { DepositoService } from '../services/deposito.service'

const depositoService = new DepositoService()

export class DepositoController {
  static async listarTodos(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const depositos = await depositoService.listarTodos()
      reply.send(depositos)
    } catch (error) {
      reply.status(500).send({
        mensagem: 'Erro ao listar depósitos',
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }

  static async obterPorId(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params
    try {
      const deposito = await depositoService.obterPorId(id)

      if (!deposito) {
        reply.status(404).send({ mensagem: 'Depósito não encontrado' })
        return
      }

      reply.send(deposito)
    } catch (error) {
      reply.status(500).send({
        mensagem: 'Erro ao obter depósito',
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }

  static async criar(request: FastifyRequest<{ Body: { nome: string; localizacao: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const novoDeposito = await depositoService.criar(request.body)
      reply.status(201).send(novoDeposito)
    } catch (error) {
      reply.status(500).send({
        mensagem: 'Erro ao criar depósito',
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }

  static async atualizar(request: FastifyRequest<{ Params: { id: string }; Body: { nome?: string; localizacao?: string } }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params
    const dados = request.body

    try {
      const deposito = await depositoService.atualizar(id, dados)
      reply.send(deposito)
    } catch (error) {
      reply.status(500).send({
        mensagem: 'Erro ao atualizar depósito',
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }

  static async excluir(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params

    try {
      const deposito = await depositoService.obterPorId(id)

      if (!deposito) {
        reply.status(404).send({ mensagem: 'Depósito não encontrado' })
        return
      }

      await depositoService.excluir(id)
      reply.status(204).send()
    } catch (error) {
      reply.status(500).send({
        mensagem: 'Erro ao excluir depósito',
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }
}