import { FastifyRequest, FastifyReply } from 'fastify';
import { CategoriaService } from '../services/categoria.service';
import { successResponse, errorResponse } from '../utils/response.helper';

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

  listarOuBuscar = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as { nome?: string };

      let categorias;
      if (query.nome) {
        // Se tem parâmetro nome, busca por nome
        categorias = await this.categoriaService.buscarPorNome(query.nome);
        return reply.code(200).send(successResponse('Busca por nome realizada', categorias));
      } else {
        // Se não tem parâmetro, lista todas
        categorias = await this.categoriaService.listarTodas();
        return reply.code(200).send(successResponse('Lista de categorias', categorias));
      }
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao listar/buscar categorias'));
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
        return reply.code(404).send(errorResponse('Categoria não encontrada'));
      }

      return reply.code(200).send(successResponse('Categoria encontrada', categoria));
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send(errorResponse('Erro ao buscar categoria'));
    }
  };

  criar = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const { nome } = request.body as CriarCategoriaBody;
      const categoria = await this.categoriaService.criar({ nome });
      return reply.code(201).send(successResponse('Categoria criada com sucesso', categoria));
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Já existe uma categoria com este nome!') {
        return reply.code(400).send(errorResponse('Erro ao criar categoria', error.message));
      }
      return reply.code(500).send(errorResponse('Erro ao criar categoria'));
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
      return reply.code(200).send(successResponse('Categoria atualizada com sucesso', categoria));
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Categoria não encontrada') {
        return reply.code(404).send(errorResponse('Categoria não encontrada'));
      }
      if (error instanceof Error && error.message === 'Já existe uma categoria com este nome') {
        return reply.code(400).send(errorResponse('Erro ao atualizar categoria', error.message));
      }
      return reply.code(500).send(errorResponse('Erro ao atualizar categoria'));
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
        return reply.code(404).send(errorResponse('Categoria não encontrada'));
      }
      if (error instanceof Error && error.message === 'Não é possível excluir categoria com produtos associados') {
        return reply.code(400).send(errorResponse('Erro ao excluir categoria', error.message));
      }
      return reply.code(500).send(errorResponse('Erro ao excluir categoria'));
    }
  };
}
