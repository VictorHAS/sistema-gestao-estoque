import { FastifyRequest, FastifyReply } from 'fastify';
import { UsuarioService } from '../services/usuario.service';
import { Cargo } from '../generated/prisma';
import { successResponse, errorResponse } from '../utils/response.helper';

interface ParamsWithId {
  id: string;
}

interface CriarUsuarioBody {
  email: string;
  senha: string;
  nome: string;
  cargo?: Cargo;
}

interface AtualizarUsuarioBody {
  email?: string;
  nome?: string;
  cargo?: Cargo;
}

interface AtualizarSenhaBody {
  senhaAtual: string;
  novaSenha: string;
}

export class UsuarioController {
  private usuarioService: UsuarioService;

  constructor() {
    this.usuarioService = new UsuarioService();
  }

  listarOuFiltrar = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as { nome?: string; cargo?: Cargo };

      let usuarios;
      let message = '';

      if (query.nome && query.cargo) {
        // Se tem ambos os parâmetros, busca por nome E filtra por cargo
        const usuariosPorNome = await this.usuarioService.buscarPorNome(query.nome);
        usuarios = usuariosPorNome.filter(user => user.cargo === query.cargo);
        message = 'Busca por nome e filtro por cargo realizada';
      } else if (query.nome) {
        // Se tem apenas nome, busca por nome
        usuarios = await this.usuarioService.buscarPorNome(query.nome);
        message = 'Busca por nome realizada';
      } else if (query.cargo) {
        // Se tem apenas cargo, filtra por cargo
        usuarios = await this.usuarioService.listarPorCargo(query.cargo);
        message = 'Filtro por cargo realizado';
      } else {
        // Se não tem parâmetros, lista todos
        usuarios = await this.usuarioService.listarTodos();
        message = 'Lista de usuários';
      }

      return reply.code(200).send(successResponse(message, usuarios));
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao listar/filtrar usuários'));
    }
  };

  obterPorId = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as ParamsWithId;
      const usuario = await this.usuarioService.obterPorId(params.id);

      if (!usuario) {
        return reply.code(404).send(errorResponse('Usuário não encontrado'));
      }

      return reply.code(200).send(successResponse('Usuário encontrado', usuario));
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao buscar usuário'));
    }
  };

  criar = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dados = request.body as CriarUsuarioBody;
      const usuario = await this.usuarioService.criar(dados);
      return reply.code(201).send(successResponse('Usuário criado com sucesso', usuario));
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Usuário com este email já existe') {
        return reply.code(400).send(errorResponse('Erro ao criar usuário', error.message));
      }
      return reply.code(500).send(errorResponse('Erro ao criar usuário'));
    }
  };

  atualizar = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as ParamsWithId;
      const dados = request.body as AtualizarUsuarioBody;
      const usuario = await this.usuarioService.atualizar(params.id, dados);
      return reply.code(200).send(successResponse('Usuário atualizado com sucesso', usuario));
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Usuário não encontrado') {
        return reply.code(404).send(errorResponse('Usuário não encontrado'));
      }
      if (error instanceof Error && error.message === 'Já existe um usuário com este email') {
        return reply.code(400).send(errorResponse('Erro ao atualizar usuário', error.message));
      }
      return reply.code(500).send(errorResponse('Erro ao atualizar usuário'));
    }
  };

  atualizarSenha = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as ParamsWithId;
      const dados = request.body as AtualizarSenhaBody;
      await this.usuarioService.atualizarSenha(params.id, dados);
      return reply.code(200).send(successResponse('Senha atualizada com sucesso'));
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Usuário não encontrado') {
        return reply.code(404).send(errorResponse('Usuário não encontrado'));
      }
      if (error instanceof Error && error.message === 'Senha atual incorreta') {
        return reply.code(400).send(errorResponse('Erro ao atualizar senha', error.message));
      }
      return reply.code(500).send(errorResponse('Erro ao atualizar senha'));
    }
  };

  excluir = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as ParamsWithId;
      await this.usuarioService.excluir(params.id);
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Usuário não encontrado') {
        return reply.code(404).send(errorResponse('Usuário não encontrado'));
      }
      if (error instanceof Error && error.message === 'Não é possível excluir usuário com compras ou vendas associadas') {
        return reply.code(400).send(errorResponse('Erro ao excluir usuário', error.message));
      }
      return reply.code(500).send(errorResponse('Erro ao excluir usuário'));
    }
  };
}
