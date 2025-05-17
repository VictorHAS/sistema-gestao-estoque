import { FastifyInstance } from 'fastify';
import { CategoriaController } from '../controllers/categoria.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';
import { autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const categoriaController = new CategoriaController();

export default async function (fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todas as categorias
  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              nome: { type: 'string' },
              dataCriacao: { type: 'string', format: 'date-time' },
              dataAtualizacao: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, categoriaController.listarTodas);

  // Obter categoria por ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, categoriaController.obterPorId);

  // Criar categoria (apenas ADMIN e GERENTE)
  fastify.post('/', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      body: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, categoriaController.criar);

  // Atualizar categoria (apenas ADMIN e GERENTE)
  fastify.put('/:id', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, categoriaController.atualizar);

  // Excluir categoria (apenas ADMIN)
  fastify.delete('/:id', {
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        204: {
          type: 'null'
        }
      }
    }
  }, categoriaController.excluir);
}
