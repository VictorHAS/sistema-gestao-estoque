import { Fornecedor } from '../generated/prisma';
import { prisma } from '../servidor';

interface CriarFornecedorDTO {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
}

interface AtualizarFornecedorDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export class FornecedorService {
  async listarTodos(): Promise<Fornecedor[]> {
    try {
      return await prisma.fornecedor.findMany();
    } catch (error) {
      throw error;
    }
  }

  async obterPorId(id: string): Promise<Fornecedor | null> {
    try {
      return await prisma.fornecedor.findUnique({
        where: { id },
        include: {
          produtos: {
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

  async criar(dados: CriarFornecedorDTO): Promise<Fornecedor> {
    try {
      // Implementar lógica de criação
      throw new Error('Método não implementado');
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: string, dados: AtualizarFornecedorDTO): Promise<Fornecedor> {
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

  async adicionarProduto(fornecedorId: string, produtoId: string): Promise<void> {
    try {
      // Implementar lógica para adicionar produto ao fornecedor
      throw new Error('Método não implementado');
    } catch (error) {
      throw error;
    }
  }

  async removerProduto(fornecedorId: string, produtoId: string): Promise<void> {
    try {
      // Implementar lógica para remover produto do fornecedor
      throw new Error('Método não implementado');
    } catch (error) {
      throw error;
    }
  }
}
