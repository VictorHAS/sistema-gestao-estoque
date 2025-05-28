import { FastifyInstance } from 'fastify';
import { AutenticacaoController } from '../controllers/autenticacao.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';

const autenticacaoController = new AutenticacaoController();

export default async function (fastify: FastifyInstance) {
  // Login
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email' },
          senha: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            usuario: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                email: { type: 'string' },
                cargo: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, autenticacaoController.login);

  // Obter usuário atual
  fastify.get('/me', {
    preHandler: [autenticar],
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nome: { type: 'string' },
            email: { type: 'string' },
            cargo: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, autenticacaoController.obterUsuarioAtual);
}
