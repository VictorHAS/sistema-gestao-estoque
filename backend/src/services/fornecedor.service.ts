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
          include: { produto: true }
        }
      }
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
      data: {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        endereco: dados.endereco,
      },
    });
  }

  async atualizar(id: string, dados: AtualizarFornecedorDTO): Promise<Fornecedor> {
    return await prisma.fornecedor.update({
      where: { id },
      data: {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        endereco: dados.endereco,
      },
    });
  }

  async excluir(id: string): Promise<void> {
    await prisma.fornecedor.delete({
      where: { id },
    });
  }

  async adicionarProduto(fornecedorId: string, produtoId: string): Promise<void> {
    await prisma.produtoFornecedor.create({
      data: {
        fornecedorId,
        produtoId,
      },
    });
  }

  async removerProduto(fornecedorId: string, produtoId: string): Promise<void> {
    await prisma.produtoFornecedor.deleteMany({
      where: {
        fornecedorId,
        produtoId,
      },
    });
  }
}
