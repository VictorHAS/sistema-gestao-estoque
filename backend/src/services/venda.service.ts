import { Venda, StatusPedido, ItemVenda } from '../generated/prisma';
import { prisma } from '../servidor';

interface ItemVendaDTO {
  produtoId: string;
  depositoId: string; // Apenas para lógica de estoque
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
    const valorTotal = itens.reduce((total, item) => total + item.quantidade * item.precoUnitario, 0);

    console.log(`[VENDA] Criando nova venda para usuário ${usuarioId} com ${itens.length} itens. Valor total: R$ ${valorTotal.toFixed(2)}`);

    const venda = await tx.venda.create({
      data: {
        usuarioId,
        status: 'PENDENTE',
        valorTotal,
      },
    });

    for (const item of itens) {
      console.log(`[VENDA] Adicionando item à venda ${venda.id}: produto ${item.produtoId}, quantidade ${item.quantidade}, depósito ${item.depositoId}`);

      await tx.itemVenda.create({
        data: {
          vendaId: venda.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
        },
      });

      const estoque = await tx.estoque.update({
        where: {
          produtoId_depositoId: {
            produtoId: item.produtoId,
            depositoId: item.depositoId,
          },
        },
        data: {
          quantidade: {
            decrement: item.quantidade,
          },
        },
      });

      console.log(`[ESTOQUE] Atualizado após venda: produto ${item.produtoId}, depósito ${item.depositoId}, nova quantidade: ${estoque.quantidade}`);

      if (estoque.quantidade < 5) {
        console.warn(`[ALERTA] Estoque baixo para produto ${item.produtoId} no depósito ${item.depositoId}: ${estoque.quantidade} unidades.`);
      }
    }

    console.log(`[VENDA] Venda ${venda.id} concluída com sucesso.`);
    return venda;
  });
}

async atualizarStatus(id: string, dados: AtualizarStatusVendaDTO): Promise<Venda> {
  try {
    console.log(`[VENDA] Atualizando status da venda ${id} para ${dados.status}`);
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
    console.log(`[VENDA] Excluindo venda ${id} e seus itens associados`);

    await tx.itemVenda.deleteMany({
      where: { vendaId: id },
    });

    await tx.venda.delete({
      where: { id },
    });

    console.log(`[VENDA] Venda ${id} excluída com sucesso.`);
  });
}

}
