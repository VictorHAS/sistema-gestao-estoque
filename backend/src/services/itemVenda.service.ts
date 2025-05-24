// Serviço responsável pela lógica de negócio dos itens de venda

import { prisma } from '../servidor';
import { ItemVenda } from '../generated/prisma';

interface CriarItemVendaDTO {
  vendaId: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export class ItemVendaService {
  // Listar todos os itens de venda
  async listarTodos(): Promise<ItemVenda[]> {
    try {
      return await prisma.itemVenda.findMany({
        include: {
          produto: true,
          venda: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Listar itens por venda
  async listarPorVenda(vendaId: string) {
  return await prisma.itemVenda.findMany({
    where: { vendaId },
    include: {
      produto: true,
    },
  });
}

  // Criar um novo item de venda
  async criar(dados: CriarItemVendaDTO): Promise<ItemVenda> {
    try {
      return await prisma.itemVenda.create({
        data: dados,
      });
    } catch (error) {
      throw error;
    }
  }

  // Obter item de venda por ID
  async obterPorId(id: string): Promise<ItemVenda | null> {
    try {
      return await prisma.itemVenda.findUnique({
        where: { id },
        include: {
          produto: true,
          venda: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Excluir item de venda
  async excluir(id: string): Promise<void> {
    try {
      await prisma.itemVenda.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
