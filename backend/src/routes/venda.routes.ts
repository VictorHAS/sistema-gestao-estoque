import { FastifyInstance } from 'fastify';
import { VendaController } from '../controllers/venda.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';
import { autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const vendaController = new VendaController();

export default async function (fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todas as vendas
  fastify.get('/', vendaController.listarTodas);

  // Obter venda por ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, vendaController.obterPorId);

  // Criar venda
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['itens'],
        properties: {
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
  }, vendaController.criar);

  // Atualizar status da venda (apenas ADMIN e GERENTE)
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
  }, vendaController.atualizarStatus);

  // Excluir venda (apenas ADMIN)
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
  }, vendaController.excluir);
}
