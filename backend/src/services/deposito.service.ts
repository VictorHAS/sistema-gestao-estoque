import { Deposito } from '../generated/prisma';
import { prisma } from '../servidor';

export interface CriarDepositoDTO {
  nome: string;
  localizacao: string;
}

export interface AtualizarDepositoDTO {
  nome?: string;
  localizacao?: string;
}

export class DepositoService {
  async listarTodos(): Promise<Deposito[]> {
    return await prisma.deposito.findMany();
  }

  async obterPorId(id: string): Promise<Deposito | null> {
    return await prisma.deposito.findUnique({
      where: { id },
      include: {
        estoque: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async criar(dados: CriarDepositoDTO): Promise<Deposito> {
    return await prisma.deposito.create({
      data: {
        nome: dados.nome,
        localizacao: dados.localizacao,
      },
    });
  }

  async atualizar(id: string, dados: AtualizarDepositoDTO): Promise<Deposito> {
    return await prisma.deposito.update({
      where: { id },
      data: {
        nome: dados.nome,
        localizacao: dados.localizacao,
      },
    });
  }

  async excluir(id: string): Promise<void> {
    await prisma.deposito.delete({
      where: { id },
    });
  }
}
