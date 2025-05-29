import { FastifyInstance } from 'fastify';
import { UsuarioController } from '../controllers/usuario.controller';
import { autenticar, autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const usuarioController = new UsuarioController();

export default async function (fastify: FastifyInstance) {
  fastify.addHook('preHandler', autenticar);

  // Listar usuários
  fastify.route({
    method: 'GET',
    url: '/',
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Usuários'],
      summary: 'Listar usuários',
      description: 'Lista todos os usuários ou filtra por nome e cargo',
      querystring: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          cargo: { type: 'string', enum: Object.values(Cargo) }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              nome: { type: 'string' },
              cargo: { type: 'string', enum: Object.values(Cargo) }
            }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: (request, reply) => usuarioController.listarOuFiltrar(request, reply)
  });

  // Obter usuário por ID
  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['Usuários'],
      summary: 'Obter usuário por ID',
      description: 'Retorna os dados de um usuário específico',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            nome: { type: 'string' },
            cargo: { type: 'string', enum: Object.values(Cargo) }
          }
        },
        404: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: (request, reply) => usuarioController.obterPorId(request, reply)
  });

  // Criar usuário
  fastify.route({
    method: 'POST',
    url: '/',
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      tags: ['Usuários'],
      summary: 'Criar usuário',
      description: 'Cria um novo usuário no sistema',
      body: {
        type: 'object',
        required: ['email', 'senha', 'nome'],
        properties: {
          email: { type: 'string', format: 'email' },
          senha: { type: 'string', minLength: 6 },
          nome: { type: 'string' },
          cargo: { type: 'string', enum: Object.values(Cargo) }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            nome: { type: 'string' },
            cargo: { type: 'string', enum: Object.values(Cargo) }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: (request, reply) => usuarioController.criar(request, reply)
  });

  // Atualizar usuário
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: {
      tags: ['Usuários'],
      summary: 'Atualizar usuário',
      description: 'Atualiza os dados de um usuário existente',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          nome: { type: 'string' },
          cargo: { type: 'string', enum: Object.values(Cargo) }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            nome: { type: 'string' },
            cargo: { type: 'string', enum: Object.values(Cargo) }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: (request, reply) => usuarioController.atualizar(request, reply)
  });

  // Atualizar senha
  fastify.route({
    method: 'PATCH',
    url: '/:id/senha',
    schema: {
      tags: ['Usuários'],
      summary: 'Atualizar senha',
      description: 'Atualiza a senha do usuário',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      },
      body: {
        type: 'object',
        required: ['senhaAtual', 'novaSenha'],
        properties: {
          senhaAtual: { type: 'string' },
          novaSenha: { type: 'string', minLength: 6 }
        }
      },
      response: {
        204: { description: 'Senha atualizada com sucesso' },
        400: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: (request, reply) => usuarioController.atualizarSenha(request, reply)
  });

  // Excluir usuário
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      tags: ['Usuários'],
      summary: 'Excluir usuário',
      description: 'Remove um usuário do sistema',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      },
      response: {
        204: { description: 'Usuário removido com sucesso' },
        404: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: (request, reply) => usuarioController.excluir(request, reply)
  });
}