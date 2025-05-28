import { Compra, ItemCompra, StatusPedido } from '../generated/prisma';
import { prisma } from '../servidor';
import { EstoqueService } from './estoque.service';

const estoqueService = new EstoqueService();


export interface ItemCompraDTO {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface CriarCompraDTO {
  fornecedorId: string;
  usuarioId: string;
  itens: ItemCompraDTO[];
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
  // Calcular o valor total com base nos itens
  const valorTotal = dados.itens.reduce((total, item) => {
    return total + item.quantidade * item.precoUnitario;
  }, 0);

  const novaCompra = await prisma.compra.create({
    data: {
      fornecedorId: dados.fornecedorId,
      usuarioId: dados.usuarioId,
      status: 'PENDENTE',
      valorTotal,
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

  const depositoPadrao = await prisma.deposito.findFirst();

  if (!depositoPadrao) {
    throw new Error('Nenhum depósito cadastrado para alocar o estoque');
  }

  for (const item of dados.itens) {
  try {
    await estoqueService.adicionarEstoque(item.produtoId, depositoPadrao.id, item.quantidade);
  } catch (err: any) {
    if (err.message.includes('Estoque não encontrado')) {
      await estoqueService.criar({
        produtoId: item.produtoId,
        depositoId: depositoPadrao.id,
        quantidade: item.quantidade,
      });
    } else {
      throw err;
    }
  }
}
  return novaCompra;
}


  async atualizarStatus(id: string, dados: AtualizarStatusCompraDTO): Promise<Compra> {
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
