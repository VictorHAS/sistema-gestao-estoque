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
    return await prisma.fornecedor.findMany({
      include: {
        produtos: {
          include: { produto: true },
        },
      },
    });
  }

  async obterPorId(id: string): Promise<Fornecedor | null> {
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
  }

  async criar(dados: CriarFornecedorDTO): Promise<Fornecedor> {
    return await prisma.fornecedor.create({
      data: dados,
    });
  }

  async atualizar(id: string, dados: AtualizarFornecedorDTO): Promise<Fornecedor | null> {
    const fornecedorExistente = await prisma.fornecedor.findUnique({ where: { id } });
    if (!fornecedorExistente) return null;

    return await prisma.fornecedor.update({
      where: { id },
      data: dados,
    });
  }

  async excluir(id: string): Promise<boolean> {
    const fornecedorExistente = await prisma.fornecedor.findUnique({ where: { id } });
    if (!fornecedorExistente) return false;

    await prisma.fornecedor.delete({ where: { id } });
    return true;
  }

  async adicionarProduto(fornecedorId: string, produtoId: string): Promise<boolean> {
    const fornecedor = await prisma.fornecedor.findUnique({ where: { id: fornecedorId } });
    const produto = await prisma.produto.findUnique({ where: { id: produtoId } });

    if (!fornecedor || !produto) return false;

    await prisma.produtoFornecedor.create({
      data: {
        fornecedorId,
        produtoId,
      },
    });

    return true;
  }

  async removerProduto(fornecedorId: string, produtoId: string): Promise<boolean> {
    const relacionamento = await prisma.produtoFornecedor.findFirst({
      where: {
        fornecedorId,
        produtoId,
      },
    });

    if (!relacionamento) return false;

    await prisma.produtoFornecedor.deleteMany({
      where: {
        fornecedorId,
        produtoId,
      },
    });

    return true;
  }
}
