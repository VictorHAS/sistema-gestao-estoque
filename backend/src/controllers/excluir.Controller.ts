import { FastifyRequest, FastifyReply } from 'fastify'
import { CompraService } from '../services/compra.service'

const compraService = new CompraService()

export class ExcluirController {
  static async excluir(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params

    try {
      const compra = await compraService.obterPorId(id)

      if (!compra) {
        reply.status(404).send({ mensagem: 'Compra não encontrada' })
        return
      }

      await compraService.excluir(id)
      reply.status(204).send()
    } catch (error: unknown) {
      if (error instanceof Error) {
        reply.status(500).send({ mensagem: 'Erro ao excluir compra', erro: error.message })
      } else {
        reply.status(500).send({ mensagem: 'Erro desconhecido ao excluir compra' })
      }
    }
  }
}
