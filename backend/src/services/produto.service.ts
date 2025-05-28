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

  async criar(dados: CriarProdutoDTO): Promise<Produto> {
    return await prisma.produto.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        codigo: dados.codigo,
        preco: dados.preco,
        categoriaId: dados.categoriaId,
      },
    });
  }

  async atualizar(id: string, dados: AtualizarProdutoDTO): Promise<Produto> {
    return await prisma.produto.update({
      where: { id },
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        codigo: dados.codigo,
        preco: dados.preco,
        categoriaId: dados.categoriaId,
      },
    });
  }

  async excluir(id: string): Promise<void> {
    await prisma.produto.delete({
      where: { id },
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
      },
    });
  }
}
