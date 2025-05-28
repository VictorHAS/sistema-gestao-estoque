import { Usuario } from '../generated/prisma';
import { verificarSenha } from '../utils/senha';
import { prisma } from '../servidor';

interface LoginDTO {
  email: string;
  senha: string;
}

export class AutenticacaoService {

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
