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
    // Calcular valor total da venda
    const valorTotal = itens.reduce((total, item) => {
      return total + item.quantidade * item.precoUnitario;
    }, 0);

    // Criar a venda
    const venda = await tx.venda.create({
      data: {
        usuarioId,
        status: 'PENDENTE',
        valorTotal,
      },
    });

    // Processar cada item da venda
    for (const item of itens) {
  // Cria o item de venda - sem depositoId (pois não existe no modelo)
  await tx.itemVenda.create({
    data: {
      vendaId: venda.id,
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario,
    },
  });

  // Atualiza estoque com base no depositoId (aqui sim usamos)
  const estoque = await tx.estoque.update({
    where: {
      produtoId_depositoId: {
        produtoId: item.produtoId,
        depositoId: item.depositoId, // usado só aqui na lógica de atualização
      },
    },
    data: {
      quantidade: {
        decrement: item.quantidade,
      },
    },
  });

  if (estoque.quantidade < 5) {
    console.warn(`Estoque baixo para produto ${item.produtoId} no depósito ${item.depositoId}: ${estoque.quantidade} unidades.`);
  }
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
