import { Usuario, Cargo } from '../generated/prisma';
import { hashSenha, verificarSenha } from '../utils/senha';
import { prisma } from '../servidor';

interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  cargo?: Cargo;
}

interface LoginDTO {
  email: string;
  senha: string;
}

export class AutenticacaoService {
  async registrar(dados: CriarUsuarioDTO): Promise<Omit<Usuario, 'senha'>> {
    try {
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email: dados.email },
      });

      if (usuarioExistente) {
        throw new Error('Usuário com este email já existe');
      }

      const senhaHash = await hashSenha(dados.senha);

      const usuario = await prisma.usuario.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          senha: senhaHash,
          cargo: dados.cargo || 'FUNCIONARIO',
        },
      });

      const { senha, ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    } catch (error) {
      throw error;
    }
  }

  async login(dados: LoginDTO): Promise<Omit<Usuario, 'senha'>> {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email: dados.email },
      });
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      const senhaValida = await verificarSenha(dados.senha, usuario.senha);
      if (!senhaValida) {
        throw new Error('Email ou senha inválidos');
      }
      const { senha, ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    } catch (error) {
      throw error;
    }
  }

  async obterUsuarioAtual(id: string): Promise<Omit<Usuario, 'senha'>> {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id },
      });
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      const { senha, ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    } catch (error) {
      throw error;
    }
  }
}
