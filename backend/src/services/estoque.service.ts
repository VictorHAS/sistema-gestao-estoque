import { Estoque } from '../generated/prisma';
import { prisma } from '../servidor';

interface AtualizarEstoqueDTO {
  quantidade: number;
}

interface CriarEstoqueDTO {
  produtoId: string;
  depositoId: string;
  quantidade: number;
}

export class EstoqueService {
  async listarTodos(): Promise<Estoque[]> {
    try {
      return await prisma.estoque.findMany({
        include: { produto: true, deposito: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async obterPorId(id: string): Promise<Estoque | null> {
    try {
      return await prisma.estoque.findUnique({
        where: { id },
        include: { produto: true, deposito: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async obterPorProdutoEDeposito(produtoId: string, depositoId: string): Promise<Estoque | null> {
    try {
      return await prisma.estoque.findUnique({
        where: { produtoId_depositoId: { produtoId, depositoId } },
        include: { produto: true, deposito: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async criar(dados: CriarEstoqueDTO): Promise<Estoque> {
    try {
      // Verifica se estoque já existe para o produto no depósito
      const existente = await this.obterPorProdutoEDeposito(dados.produtoId, dados.depositoId);
      if (existente) {
        throw new Error('Estoque já existe para este produto neste depósito.');
      }
      return await prisma.estoque.create({
        data: {
          produtoId: dados.produtoId,
          depositoId: dados.depositoId,
          quantidade: dados.quantidade,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: string, dados: AtualizarEstoqueDTO): Promise<Estoque> {
    try {
      return await prisma.estoque.update({
        where: { id },
        data: { quantidade: dados.quantidade },
      });
    } catch (error) {
      throw error;
    }
  }

  async atualizarQuantidade(produtoId: string, depositoId: string, quantidade: number): Promise<Estoque> {
    try {
      return await prisma.estoque.update({
        where: { produtoId_depositoId: { produtoId, depositoId } },
        data: { quantidade },
      });
    } catch (error) {
      throw error;
    }
  }

  async adicionarEstoque(produtoId: string, depositoId: string, quantidade: number): Promise<Estoque> {
    try {
      const estoqueAtual = await this.obterPorProdutoEDeposito(produtoId, depositoId);
      if (!estoqueAtual) {
        throw new Error('Estoque não encontrado para adicionar quantidade.');
      }
      return await prisma.estoque.update({
        where: { produtoId_depositoId: { produtoId, depositoId } },
        data: { quantidade: estoqueAtual.quantidade + quantidade },
      });
    } catch (error) {
      throw error;
    }
  }

  async removerEstoque(produtoId: string, depositoId: string, quantidade: number): Promise<Estoque> {
    try {
      const estoqueAtual = await this.obterPorProdutoEDeposito(produtoId, depositoId);
      if (!estoqueAtual) {
        throw new Error('Estoque não encontrado para remover quantidade.');
      }
      if (estoqueAtual.quantidade < quantidade) {
        throw new Error('Quantidade insuficiente em estoque para remoção.');
      }
      return await prisma.estoque.update({
        where: { produtoId_depositoId: { produtoId, depositoId } },
        data: { quantidade: estoqueAtual.quantidade - quantidade },
      });
    } catch (error) {
      throw error;
    }
  }

  async listarProdutosComEstoqueBaixo(limiteMinimo: number = 10): Promise<Estoque[]> {
    try {
      return await prisma.estoque.findMany({
        where: { quantidade: { lt: limiteMinimo } },
        include: { produto: true, deposito: true },
      });
    } catch (error) {
      throw error;
    }
  }
}
