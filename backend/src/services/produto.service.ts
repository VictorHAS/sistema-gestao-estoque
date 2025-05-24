import { Produto } from '../generated/prisma';
import { prisma } from '../servidor';

export interface CriarProdutoDTO {
  nome: string;
  descricao?: string;
  codigo: string;
  preco: number;
  categoriaId: string;
}

export interface AtualizarProdutoDTO {
  nome?: string;
  descricao?: string;
  codigo?: string;
  preco?: number;
  categoriaId?: string;
}

export class ProdutoService {
  async listarTodos(): Promise<Produto[]> {
    try {
      return await prisma.produto.findMany({
        include: {
          categoria: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async obterPorId(id: string): Promise<Produto | null> {
    try {
      return await prisma.produto.findUnique({
        where: { id },
        include: {
          categoria: true,
          fornecedores: {
            include: {
              fornecedor: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async criar(dados: CriarProdutoDTO): Promise<Produto> {
    try {
      const novoProduto = await prisma.produto.create({
        data: {
          nome: dados.nome,
          descricao: dados.descricao,
          codigo: dados.codigo,
          preco: dados.preco,
          categoriaId: dados.categoriaId,
        },
        include: {
          categoria: true,
        },
      });

      return novoProduto;
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: string, dados: AtualizarProdutoDTO): Promise<Produto> {
    try {
      const produtoAtualizado = await prisma.produto.update({
        where: { id },
        data: {
          nome: dados.nome,
          descricao: dados.descricao,
          codigo: dados.codigo,
          preco: dados.preco,
          categoriaId: dados.categoriaId,
        },
        include: {
          categoria: true,
        },
      });

      return produtoAtualizado;
    } catch (error) {
      throw error;
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      await prisma.produtoFornecedor.deleteMany({
        where: { produtoId: id },
      });

      await prisma.itemCompra.deleteMany({
        where: { produtoId: id },
      });

      await prisma.produto.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async buscarPorNome(nome: string): Promise<Produto[]> {
    try {
      return await prisma.produto.findMany({
        where: {
          nome: {
            contains: nome,
            mode: 'insensitive',
          },
        },
        include: {
          categoria: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}