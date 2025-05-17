import { Deposito } from '../generated/prisma';
import { prisma } from '../servidor';

interface CriarDepositoDTO {
  nome: string;
  localizacao: string;
}

interface AtualizarDepositoDTO {
  nome?: string;
  localizacao?: string;
}

export class DepositoService {
  async listarTodos(): Promise<Deposito[]> {
    try {
      return await prisma.deposito.findMany();
    } catch (error) {
      throw error;
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
      });
    } catch (error) {
      throw error;
    }
  }

  async criar(dados: CriarDepositoDTO): Promise<Deposito> {
    try {
      // Implementar lógica de criação
      throw new Error('Método não implementado');
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: string, dados: AtualizarDepositoDTO): Promise<Deposito> {
    try {
      // Implementar lógica de atualização
      throw new Error('Método não implementado');
    } catch (error) {
      throw error;
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      // Implementar lógica de exclusão
      throw new Error('Método não implementado');
    } catch (error) {
      throw error;
    }
  }
}
