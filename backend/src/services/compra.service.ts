import { Compra, ItemCompra, StatusPedido } from '../generated/prisma';
import { prisma } from '../servidor';

interface ItemCompraDTO {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface CriarCompraDTO {
  fornecedorId: string;
  usuarioId: string;
  itens: {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
  }[];
}

interface AtualizarStatusCompraDTO {
  status: StatusPedido;
}

export class CompraService {
  async listarTodas(): Promise<Compra[]> {
    try {
      return await prisma.compra.findMany({
        include: {
          fornecedor: true,
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

  async obterPorId(id: string): Promise<Compra | null> {
    try {
      return await prisma.compra.findUnique({
        where: { id },
        include: {
          fornecedor: true,
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

  async criar(dados: CriarCompraDTO): Promise<Compra> {
    const novaCompra = await prisma.compra.create({
      data: {
        fornecedorId: dados.fornecedorId,
        usuarioId: dados.usuarioId,
        status: 'PENDENTE',
        itens: {
          create: dados.itens.map(item => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
          })),
        },
      },
      include: {
        fornecedor: true,
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

    return novaCompra;
  }

  async atualizarStatus(id: string, dados: AtualizarStatusCompraDTO): Promise<Compra> {
    try {
      const compraAtualizada = await prisma.compra.update({
        where: { id },
        data: {
          status: dados.status,
        },
        include: {
          fornecedor: true,
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

      return compraAtualizada;
    } catch (error) {
      throw error;
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      await prisma.itemCompra.deleteMany({
        where: { compraId: id },
      });
      await prisma.compra.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

}