import { Produto } from '../generated/prisma';
import { prisma } from '../servidor';

interface CriarProdutoDTO {
  nome: string;
  descricao?: string;
  codigo: string;
  preco: number;
  categoriaId: string;
  fornecedorIds?: string[];
}

interface AtualizarProdutoDTO {
  nome?: string;
  descricao?: string;
  codigo?: string;
  preco?: number;
  categoriaId?: string;
  fornecedorIds?: string[];
}

export class ProdutoService {
  async listarTodos(): Promise<Produto[]> {
    return await prisma.produto.findMany({
      include: {
        categoria: true,
      },
    });
  }

  async obterPorId(id: string): Promise<Produto | null> {
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
  }

  async buscarPorNome(nome: string): Promise<Produto[]> {
    return await prisma.produto.findMany({
      where: {
        nome: {
          contains: nome,
          mode: 'insensitive',
        },
      },
      include: {
        categoria: true,
        fornecedores: {
          include: {
            fornecedor: true,
          },
        },
      },
    });
  }

  async criar(dados: CriarProdutoDTO): Promise<Produto> {
    return await prisma.produto.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        codigo: dados.codigo,
        preco: dados.preco,
        categoriaId: dados.categoriaId,
        ...(dados.fornecedorIds && {
          fornecedores: {
            create: dados.fornecedorIds.map((fornecedorId) => ({
            fornecedor: {
              connect: { id: fornecedorId }
              }
            })),
          },
        }),
      },
    });
  }

  async atualizar(id: string, dados: AtualizarProdutoDTO): Promise<Produto> {
    const updateData: any = {
      nome: dados.nome,
      descricao: dados.descricao,
      codigo: dados.codigo,
      preco: dados.preco,
      categoriaId: dados.categoriaId,
    };

    // Se fornecedorIds foram fornecidos, atualizar os relacionamentos
    if (dados.fornecedorIds) {
      updateData.fornecedores = {
        deleteMany: {}, // Remove todos os relacionamentos existentes
        create: dados.fornecedorIds.map((fornecedorId) => ({
          fornecedor: {
            connect: { id: fornecedorId }
          }
        })),
      };
    }

    return await prisma.produto.update({
      where: { id },
      data: updateData,
    });
  }

  async excluir(id: string): Promise<void> {
    const produto = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    await prisma.produto.delete({
      where: { id },
    });
  }

}
