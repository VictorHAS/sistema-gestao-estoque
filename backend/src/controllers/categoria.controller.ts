import { FastifyRequest, FastifyReply } from 'fastify';
import { CategoriaService } from '../services/categoria.service';

interface ParamsWithId {
  id: string;
}

interface CriarCategoriaBody {
  nome: string;
}

interface AtualizarCategoriaBody {
  nome: string;
}

export class CategoriaController {
  private categoriaService: CategoriaService;

  constructor() {
    this.categoriaService = new CategoriaService();
  }

  listarTodas = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categorias = await this.categoriaService.listarTodas();
      return reply.code(200).send(categorias);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao listar categorias' });
    }
  };

  obterPorId = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const categoria = await this.categoriaService.obterPorId(id);

      if (!categoria) {
        return reply.code(404).send({ error: 'Categoria não encontrada' });
      }

      return reply.code(200).send(categoria);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao buscar categoria' });
    }
  };

  criar = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { nome } = request.body as CriarCategoriaBody;
      const categoria = await this.categoriaService.criar({ nome });
      return reply.code(201).send(categoria);
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Categoria com este nome já existe') {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao criar categoria' });
    }
  };

  atualizar = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params as ParamsWithId;
      const { nome } = request.body as AtualizarCategoriaBody;
      const categoria = await this.categoriaService.atualizar(id, { nome });
      return reply.code(200).send(categoria);
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Categoria não encontrada') {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao atualizar categoria' });
    }
  };

  excluir = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params as ParamsWithId;
      await this.categoriaService.excluir(id);
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Categoria não encontrada') {
        return reply.code(404).send({ error: error.message });
      }
      if (error instanceof Error && error.message === 'Não é possível excluir categoria com produtos associados') {
        return reply.code(400).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Erro ao excluir categoria' });
    }
  };
}
