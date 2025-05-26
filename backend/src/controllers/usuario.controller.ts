import { FastifyRequest, FastifyReply } from 'fastify';
import { UsuarioService } from '../services/usuario.service';
import { Cargo } from '../generated/prisma';

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

      if (query.nome && query.cargo) {
        // Se tem ambos os parâmetros, busca por nome E filtra por cargo
        const usuariosPorNome = await this.usuarioService.buscarPorNome(query.nome);
        usuarios = usuariosPorNome.filter(user => user.cargo === query.cargo);
      } else if (query.nome) {
        // Se tem apenas nome, busca por nome
        usuarios = await this.usuarioService.buscarPorNome(query.nome);
      } else if (query.cargo) {
        // Se tem apenas cargo, filtra por cargo
        usuarios = await this.usuarioService.listarPorCargo(query.cargo);
      } else {
        // Se não tem parâmetros, lista todos
        usuarios = await this.usuarioService.listarTodos();
      }

      return reply.code(200).send(usuarios);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao listar/filtrar usuários' });
    }
  };

  obterPorId = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as ParamsWithId;
      const usuario = await this.usuarioService.obterPorId(params.id);

      if (!usuario) {
        return reply.code(404).send({ error: 'Usuário não encontrado' });
      }

      return reply.code(200).send(usuario);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao buscar usuário' });
    }
  };

  criar = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dados = request.body as CriarUsuarioBody;
      const usuario = await this.usuarioService.criar(dados);
      return reply.code(201).send(usuario);
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Usuário com este email já existe') {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao criar usuário' });
    }
  };

  atualizar = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as ParamsWithId;
      const dados = request.body as AtualizarUsuarioBody;
      const usuario = await this.usuarioService.atualizar(params.id, dados);
      return reply.code(200).send(usuario);
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Usuário não encontrado') {
        return reply.code(404).send({ error: error.message });
      }
      if (error instanceof Error && error.message === 'Já existe um usuário com este email') {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao atualizar usuário' });
    }
  };

  atualizarSenha = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const params = request.params as ParamsWithId;
      const dados = request.body as AtualizarSenhaBody;
      await this.usuarioService.atualizarSenha(params.id, dados);
      return reply.code(200).send({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Usuário não encontrado') {
        return reply.code(404).send({ error: error.message });
      }
      if (error instanceof Error && error.message === 'Senha atual incorreta') {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao atualizar senha' });
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
        return reply.code(404).send({ error: error.message });
      }
      if (error instanceof Error && error.message === 'Não é possível excluir usuário com compras ou vendas associadas') {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao excluir usuário' });
    }
  };
}
