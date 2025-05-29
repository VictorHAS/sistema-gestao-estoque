import { FastifyInstance } from 'fastify';
import { DepositoController } from '../controllers/deposito.controller';
import { autenticar, autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const depositoController = new DepositoController();

export default async function (fastify: FastifyInstance) {
  // Middleware global de autenticação
  fastify.addHook('preHandler', autenticar);

  // Listar todos os depósitos
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Depósitos'],
      summary: 'Listar depósitos',
      description: 'Retorna todos os depósitos cadastrados',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              nome: { type: 'string' },
              localizacao: { type: 'string' },
              criadoEm: { type: 'string', format: 'date-time' },
            }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            erro: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: depositoController.listarTodos
  });

  // Obter depósito por ID
  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Depósitos'],
      summary: 'Obter depósito por ID',
      description: 'Retorna os dados de um depósito específico',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID do depósito' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            localizacao: { type: 'string' },
            criadoEm: { type: 'string', format: 'date-time' },
          }
        },
        404: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            erro: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: depositoController.obterPorId
  });

  // Criar novo depósito
  fastify.route({
    method: 'POST',
    url: '/',
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Depósitos'],
      summary: 'Criar depósito',
      description: 'Cria um novo depósito com nome e localização',
      body: {
        type: 'object',
        required: ['nome', 'localizacao'],
        properties: {
          nome: { type: 'string' },
          localizacao: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            localizacao: { type: 'string' },
            criadoEm: { type: 'string', format: 'date-time' },
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            erro: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: depositoController.criar
  });

  // Atualizar depósito
  fastify.route({
    method: 'PUT',
    url: '/:id',
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Depósitos'],
      summary: 'Atualizar depósito',
      description: 'Atualiza os dados de um depósito existente',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID do depósito a ser atualizado' }
        }
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          localizacao: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            localizacao: { type: 'string' },
            atualizadoEm: { type: 'string', format: 'date-time' },
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            erro: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: depositoController.atualizar
  });

  // Excluir depósito
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      tags: ['Depósitos'],
      summary: 'Excluir depósito',
      description: 'Exclui um depósito específico. Apenas administradores podem executar essa operação.',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID do depósito a ser excluído' }
        }
      },
      response: {
        204: { description: 'Depósito excluído com sucesso' },
        404: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            erro: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: depositoController.excluir
  });
}