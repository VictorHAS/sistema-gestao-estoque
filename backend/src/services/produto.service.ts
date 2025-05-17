import { Produto } from '../generated/prisma';
import { prisma } from '../servidor';

interface CriarProdutoDTO {
  nome: string;
  descricao?: string;
  codigo: string;
  preco: number;
  categoriaId: string;
}

interface AtualizarProdutoDTO {
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
      // Implementar lógica de criação
      throw new Error('Método não implementado');
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: string, dados: AtualizarProdutoDTO): Promise<Produto> {
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

  async buscarPorNome(nome: string): Promise<Produto[]> {
    try {
      // Implementar lógica de busca por nome
      throw new Error('Método não implementado');
    } catch (error) {
      throw error;
    }
  }
}
