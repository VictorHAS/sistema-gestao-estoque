import { Venda, StatusPedido, ItemVenda } from '../generated/prisma';
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
            select: { id: true, nome: true, email: true, cargo: true },
          },
          itens: {
            include: { produto: true },
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
            select: { id: true, nome: true, email: true, cargo: true },
          },
          itens: {
            include: { produto: true },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async criar(dados: CriarVendaDTO): Promise<Venda> {
  const { usuarioId, itens } = dados;

  return await prisma.$transaction(async (tx) => {
    // Calcula o valor total da venda somando preçoUnitario * quantidade de cada item
    const valorTotal = itens.reduce(
      (total, item) => total + item.precoUnitario * item.quantidade,
      0
    );

    // Cria a venda, incluindo o valorTotal
    const venda = await tx.venda.create({
      data: {
        usuarioId,
        status: 'PENDENTE', // ou StatusPedido.PENDENTE
        valorTotal, // <-- necessário para evitar erro
      },
    });

    // Cria os itens e atualiza o estoque
    for (const item of itens) {
      const estoque = await tx.estoque.findFirst({
        where: { produtoId: item.produtoId },
      });

      if (!estoque || estoque.quantidade < item.quantidade) {
        throw new Error(
          `Estoque insuficiente para o produto ${item.produtoId}`
        );
      }

      await tx.itemVenda.create({
        data: {
          vendaId: venda.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        },
      });

      await tx.estoque.update({
        where: { id: estoque.id },
        data: { quantidade: estoque.quantidade - item.quantidade },
      });
    }

    return venda;
  });
}


  async atualizarStatus(id: string, dados: AtualizarStatusVendaDTO): Promise<Venda> {
    try {
      return await prisma.venda.update({
        where: { id },
        data: { status: dados.status },
      });
    } catch (error) {
      throw error;
    }
  }

  async excluir(id: string): Promise<void> {
    return await prisma.$transaction(async (tx) => {
      // Remove itens da venda
      await tx.itemVenda.deleteMany({
        where: { vendaId: id },
      });

      // Remove a venda
      await tx.venda.delete({
        where: { id },
      });
    });
  }
}
