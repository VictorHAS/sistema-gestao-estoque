import { Deposito } from '../generated/prisma'
import { prisma } from '../servidor'

interface CriarDepositoDTO {
  nome: string
  localizacao: string
}

interface AtualizarDepositoDTO {
  nome?: string
  localizacao?: string
}

export class DepositoService {
  async listarTodos(): Promise<Deposito[]> {
    try {
      return await prisma.deposito.findMany()
    } catch (error) {
      throw error
    }
  }

  async obterPorId(id: string): Promise<Deposito | null> {
    try {
      return await prisma.deposito.findUnique({
        where: { id },
        include: {
          estoque: {
            include: {
              produto: true,
            },
          },
        },
      })
    } catch (error) {
      throw error
    }
  }

  async criar(dados: CriarDepositoDTO): Promise<Deposito> {
    try {
      const novoDeposito = await prisma.deposito.create({
        data: {
          nome: dados.nome,
          localizacao: dados.localizacao,
        },
      })
      return novoDeposito
    } catch (error) {
      throw error
    }
  }

  async atualizar(id: string, dados: AtualizarDepositoDTO): Promise<Deposito> {
    try {
      const depositoAtualizado = await prisma.deposito.update({
        where: { id },
        data: {
          nome: dados.nome,
          localizacao: dados.localizacao,
        },
      })
      return depositoAtualizado
    } catch (error) {
      throw error
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      await prisma.estoque.deleteMany({
        where: { depositoId: id },
      })
      await prisma.deposito.delete({
        where: { id },
      })
    } catch (error) {
      throw error
    }
  }
}
