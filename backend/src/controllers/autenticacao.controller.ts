import { FastifyRequest, FastifyReply } from 'fastify';
import { AutenticacaoService } from '../services/autenticacao.service';
import { successResponse, errorResponse } from '../utils/response.helper';

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
      return reply.code(200).send(successResponse('Login realizado com sucesso', { token, usuario }));
    } catch (error) {
      request.log.error(error);
      if (
        error instanceof Error && (error.message === 'Email ou senha inválidos' || error.message === 'Usuário não encontrado')
      ) {
        return reply.code(401).send(errorResponse('Email ou senha inválidos'));
      }
      return reply.code(500).send(errorResponse('Erro ao fazer login'));
    }
  };

  obterUsuarioAtual = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.usuario.id;
      const usuario = await this.autenticacaoService.obterUsuarioAtual(userId);
      return reply.code(200).send(successResponse('Usuário atual obtido com sucesso', usuario));
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Usuário não encontrado') {
        return reply.code(404).send(errorResponse('Usuário não encontrado'));
      }
      return reply.code(500).send(errorResponse('Erro ao obter usuário atual'));
    }
  };
}
