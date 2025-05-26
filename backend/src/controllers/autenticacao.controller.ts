import { FastifyRequest, FastifyReply } from 'fastify';
import { AutenticacaoService } from '../services/autenticacao.service';

interface LoginBody {
  email: string;
  senha: string;
}

export class AutenticacaoController {
  private autenticacaoService: AutenticacaoService;

  constructor() {
    this.autenticacaoService = new AutenticacaoService();
  }

  login = async (
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { email, senha } = request.body;
      const usuario = await this.autenticacaoService.login({ email, senha });
      const token = await (reply).jwtSign({
        id: usuario.id,
        email: usuario.email,
        cargo: usuario.cargo,
      });
      return reply.code(200).send({ token, usuario });
    } catch (error) {
      request.log.error(error);
      if (
        error instanceof Error && (error.message === 'Email ou senha inválidos' || error.message === 'Usuário não encontrado')
      ) {
        return reply.code(401).send({ error: 'Email ou senha inválidos' });
      }
      return reply.code(500).send({ error: 'Erro ao fazer login' });
    }
  };

  obterUsuarioAtual = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.usuario.id;
      const usuario = await this.autenticacaoService.obterUsuarioAtual(userId);
      return reply.code(200).send(usuario);
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Usuário não encontrado') {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao obter usuário atual' });
    }
  };
}
