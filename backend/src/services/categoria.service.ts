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
      return await prisma.categoria.findMany({
        include: {
          _count: {
            select: { produtos: true }
          }
        },
        orderBy: {
          nome: 'asc'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async obterPorId(id: string): Promise<Categoria | null> {
    try {
      return await prisma.categoria.findUnique({
        where: { id },
        include: {
          produtos: true,
          _count: {
            select: { produtos: true }
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async buscarPorNome(nome: string): Promise<Categoria[]> {
    try {
      return await prisma.categoria.findMany({
        where: {
          nome: {
            contains: nome,
            mode: 'insensitive'
          }
        },
        orderBy: {
          nome: 'asc'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async criar(dados: CriarCategoriaDTO): Promise<Categoria> {
    try {
      // Verificar se já existe uma categoria com este nome
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { nome: dados.nome }
      });

      if (categoriaExistente) {
        throw new Error('Já existe uma categoria com este nome!');
      }

      return await prisma.categoria.create({
        data: dados,
        include: {
          _count: {
            select: { produtos: true }
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: string, dados: AtualizarCategoriaDTO): Promise<Categoria> {
    try {
      // Verificar se a categoria existe
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { id }
      });

      if (!categoriaExistente) {
        throw new Error('Categoria não encontrada');
      }

      // Se está atualizando o nome, verificar se não existe outra categoria com o mesmo nome
      if (dados.nome) {
        const categoriaComMesmoNome = await prisma.categoria.findFirst({
          where: {
            nome: dados.nome,
            id: { not: id }
          }
        });

        if (categoriaComMesmoNome) {
          throw new Error('Já existe uma categoria com este nome');
        }
      }

      return await prisma.categoria.update({
        where: { id },
        data: dados,
        include: {
          _count: {
            select: { produtos: true }
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      // Verificar se a categoria existe
      const categoria = await prisma.categoria.findUnique({
        where: { id },
        include: {
          produtos: true
        }
      });

      if (!categoria) {
        throw new Error('Categoria não encontrada');
      }

      // Verificar se há produtos associados
      if (categoria.produtos.length > 0) {
        throw new Error('Não é possível excluir categoria com produtos associados');
      }

      await prisma.categoria.delete({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }
}
