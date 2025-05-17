import { Venda, StatusPedido } from '../generated/prisma';
import { prisma } from '../servidor';

interface ItemVendaDTO {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

interface CriarVendaDTO {
  usuarioId: string;
  itens: ItemVendaDTO[];
}

interface AtualizarStatusVendaDTO {
  status: StatusPedido;
}

export class VendaService {
  async listarTodas(): Promise<Venda[]> {
    try {
      return await prisma.venda.findMany({
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              cargo: true,
            },
          },
          itens: {
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

  async obterPorId(id: string): Promise<Venda | null> {
    try {
      return await prisma.venda.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              cargo: true,
            },
          },
          itens: {
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

  async criar(dados: CriarVendaDTO): Promise<Venda> {
    try {
      // Implementar lógica de criação de venda
      throw new Error('Método não implementado');
    } catch (error) {
      throw error;
    }
  }

  async atualizarStatus(id: string, dados: AtualizarStatusVendaDTO): Promise<Venda> {
    try {
      // Implementar lógica de atualização de status
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
