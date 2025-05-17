import { Categoria } from '../generated/prisma';
import { prisma } from '../servidor';

interface CriarCategoriaDTO {
  nome: string;
}

interface AtualizarCategoriaDTO {
  nome?: string;
}

export class CategoriaService {
  async listarTodas(): Promise<Categoria[]> {
    try {
      return await prisma.categoria.findMany();
    } catch (error) {
      throw error;
    }
  }

  async obterPorId(id: string): Promise<Categoria | null> {
    try {
      return await prisma.categoria.findUnique({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  async criar(dados: CriarCategoriaDTO): Promise<Categoria> {
    try {
      return await prisma.categoria.create({
        data: dados,
      });
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: string, dados: AtualizarCategoriaDTO): Promise<Categoria> {
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
}
