import { FastifyInstance } from 'fastify';
import { CompraController } from '../controllers/compra.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';
import { autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const compraController = new CompraController();

export default async function (fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todas as compras
  fastify.get('/', CompraController.listarTodas);

  // Obter compra por ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, CompraController.obterPorId);

fastify.post('/', {
  schema: {
    body: {
      type: 'object',
      required: ['fornecedorId', 'itens'],
      properties: {
        fornecedorId: { type: 'string' },
        itens: {
          type: 'array',
          items: {
            type: 'object',
            required: ['produtoId', 'quantidade', 'precoUnitario'],
            properties: {
              produtoId: { type: 'string' },
              quantidade: { type: 'integer', minimum: 1 },
              precoUnitario: { type: 'number', minimum: 0 }
            }
          }
        }
      }
    }
  }
}, CompraController.criar);

  // Atualizar status da compra (apenas ADMIN e GERENTE)
  fastify.patch('/:id/status', {
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
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['PENDENTE', 'CONCLUIDO', 'CANCELADO'] }
        }
      }
    }
  }, CompraController.atualizarStatus);

  // Excluir compra (apenas ADMIN)
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
  }, CompraController.excluir);
}
