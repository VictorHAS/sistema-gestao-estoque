import { FastifyInstance } from 'fastify';
import { AutenticacaoController } from '../controllers/autenticacao.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';

const autenticacaoController = new AutenticacaoController();

export default async function (fastify: FastifyInstance) {
  // Login
  fastify.post('/login', {
    schema: {
      tags: ['Autenticação'],
      summary: 'Login de usuário',
      description: 'Realiza a autenticação de um usuário e retorna o token JWT',
      body: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'E-mail do usuário'
          },
          senha: {
            type: 'string',
            description: 'Senha do usuário'
          }
        }
      },
      response: {
        200: {
          description: 'Login bem-sucedido',
          type: 'object',
          properties: {
            data:{
              type: 'object',
              properties: {
              token: {
                type: 'string',
                description: 'Token JWT para autenticação'
              },
              usuario: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  nome: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  cargo: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        401: {
          description: 'Credenciais inválidas',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, autenticacaoController.login);

  // Obter usuário atual
  fastify.get('/me', {
    preHandler: [autenticar],
    schema: {
      tags: ['Autenticação'],
      summary: 'Obter dados do usuário autenticado',
      description: 'Retorna os dados do usuário logado, baseado no token JWT enviado no cabeçalho Authorization',
      response: {
        200: {
          description: 'Dados do usuário autenticado',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                email: { type: 'string', format: 'email' },
                cargo: { type: 'string' },
                dataCriacao: { type: 'string', format: 'date-time' },
                dataAtualizacao: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        401: {
          description: 'Token inválido ou ausente',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, autenticacaoController.obterUsuarioAtual);
}
