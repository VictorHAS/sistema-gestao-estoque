import { Usuario, Cargo } from '../generated/prisma';
import { prisma } from '../servidor';
import bcrypt from 'bcrypt';

interface CriarUsuarioDTO {
  email: string;
  senha: string;
  nome: string;
  cargo?: Cargo;
}

interface AtualizarUsuarioDTO {
  email?: string;
  nome?: string;
  cargo?: Cargo;
}

interface AtualizarSenhaDTO {
  senhaAtual: string;
  novaSenha: string;
}

export class UsuarioService {
  async listarTodos(): Promise<Omit<Usuario, 'senha'>[]> {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          email: true,
          nome: true,
          cargo: true,
          dataCriacao: true,
          dataAtualizacao: true
        },
        orderBy: {
          nome: 'asc'
        }
      });
      return usuarios;
    } catch (error) {
      throw error;
    }
  }

  async obterPorId(id: string): Promise<Omit<Usuario, 'senha'> | null> {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          nome: true,
          cargo: true,
          dataCriacao: true,
          dataAtualizacao: true
        }
      });
      return usuario;
    } catch (error) {
      throw error;
    }
  }

  async obterPorEmail(email: string): Promise<Usuario | null> {
    try {
      return await prisma.usuario.findUnique({
        where: { email }
      });
    } catch (error) {
      throw error;
    }
  }

  async buscarPorNome(nome: string): Promise<Omit<Usuario, 'senha'>[]> {
    try {
      const usuarios = await prisma.usuario.findMany({
        where: {
          nome: {
            contains: nome,
            mode: 'insensitive'
          }
        },
        select: {
          id: true,
          email: true,
          nome: true,
          cargo: true,
          dataCriacao: true,
          dataAtualizacao: true
        },
        orderBy: {
          nome: 'asc'
        }
      });
      return usuarios;
    } catch (error) {
      throw error;
    }
  }

  async criar(dados: CriarUsuarioDTO): Promise<Omit<Usuario, 'senha'>> {
    try {
      // Verificar se já existe um usuário com este email
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: dados.email }
      });

      if (usuarioExistente) {
        throw new Error('Usuário com este email já existe');
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(dados.senha, 10);

      const usuario = await prisma.usuario.create({
        data: {
          ...dados,
          senha: senhaHash,
          cargo: dados.cargo || Cargo.FUNCIONARIO
        },
        select: {
          id: true,
          email: true,
          nome: true,
          cargo: true,
          dataCriacao: true,
          dataAtualizacao: true
        }
      });

      return usuario;
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: string, dados: AtualizarUsuarioDTO): Promise<Omit<Usuario, 'senha'>> {
    try {
      // Verificar se o usuário existe
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { id }
      });

      if (!usuarioExistente) {
        throw new Error('Usuário não encontrado');
      }

      // Se está atualizando o email, verificar se não existe outro usuário com o mesmo email
      if (dados.email) {
        const usuarioComMesmoEmail = await prisma.usuario.findFirst({
          where: {
            email: dados.email,
            id: { not: id }
          }
        });

        if (usuarioComMesmoEmail) {
          throw new Error('Já existe um usuário com este email');
        }
      }

      const usuario = await prisma.usuario.update({
        where: { id },
        data: dados,
        select: {
          id: true,
          email: true,
          nome: true,
          cargo: true,
          dataCriacao: true,
          dataAtualizacao: true
        }
      });

      return usuario;
    } catch (error) {
      throw error;
    }
  }

  async atualizarSenha(id: string, dados: AtualizarSenhaDTO): Promise<void> {
    try {
      // Verificar se o usuário existe
      const usuario = await prisma.usuario.findUnique({
        where: { id }
      });

      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se a senha atual está correta
      const senhaValida = await bcrypt.compare(dados.senhaAtual, usuario.senha);
      if (!senhaValida) {
        throw new Error('Senha atual incorreta');
      }

      // Hash da nova senha
      const novaSenhaHash = await bcrypt.hash(dados.novaSenha, 10);

      await prisma.usuario.update({
        where: { id },
        data: {
          senha: novaSenhaHash
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      // Verificar se o usuário existe
      const usuario = await prisma.usuario.findUnique({
        where: { id },
        include: {
          compras: true,
          vendas: true
        }
      });

      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se há compras ou vendas associadas
      if (usuario.compras.length > 0 || usuario.vendas.length > 0) {
        throw new Error('Não é possível excluir usuário com compras ou vendas associadas');
      }

      await prisma.usuario.delete({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }

  async listarPorCargo(cargo: Cargo): Promise<Omit<Usuario, 'senha'>[]> {
    try {
      const usuarios = await prisma.usuario.findMany({
        where: { cargo },
        select: {
          id: true,
          email: true,
          nome: true,
          cargo: true,
          dataCriacao: true,
          dataAtualizacao: true
        },
        orderBy: {
          nome: 'asc'
        }
      });
      return usuarios;
    } catch (error) {
      throw error;
    }
  }
}
