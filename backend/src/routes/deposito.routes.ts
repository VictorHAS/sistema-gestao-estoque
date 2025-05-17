import { FastifyInstance } from 'fastify';
import { DepositoController } from '../controllers/deposito.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';
import { autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const depositoController = new DepositoController();

export default async function (fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todos os depósitos
  fastify.get('/', depositoController.listarTodos);

  // Obter depósito por ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, depositoController.obterPorId);

  // Criar depósito (apenas ADMIN e GERENTE)
  fastify.post('/', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      body: {
        type: 'object',
        required: ['nome', 'localizacao'],
        properties: {
          nome: { type: 'string' },
          localizacao: { type: 'string' }
        }
      }
    }
  }, depositoController.criar);

  // Atualizar depósito (apenas ADMIN e GERENTE)
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
        properties: {
          nome: { type: 'string' },
          localizacao: { type: 'string' }
        }
      }
    }
  }, depositoController.atualizar);

  // Excluir depósito (apenas ADMIN)
  fastify.delete('/:id', {
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, depositoController.excluir);
}
