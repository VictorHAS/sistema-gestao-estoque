import { FastifyInstance } from 'fastify';
import { CompraController } from '../controllers/compra.controller';
import { autenticar, autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo, StatusPedido } from '../generated/prisma';

const compraController = new CompraController();

export default async function compraRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', autenticar);

  fastify.get('/', {
    schema: {
      tags: ['Compras'],
      summary: 'Listar todas as compras',
      description: 'Retorna todas as compras registradas',
      response: {
        200: { type: 'array', items: { type: 'object' } }
      },
      security: [{ bearerAuth: [] }]
    }
  }, compraController.listarTodas);

  fastify.get<{ Params: { id: string } }>('/:id', {
    schema: {
      tags: ['Compras'],
      summary: 'Obter compra por ID',
      description: 'Retorna os detalhes de uma compra específica pelo ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: { type: 'object' },
        404: { type: 'object', properties: { mensagem: { type: 'string' } } }
      },
      security: [{ bearerAuth: [] }]
    }
  }, compraController.obterPorId);

  fastify.post('/', {
    preHandler: autorizar([Cargo.ADMIN, Cargo.GERENTE]),
    schema: {
      tags: ['Compras'],
      summary: 'Criar nova compra',
      description: 'Cria uma nova compra no sistema',
      body: {
        type: 'object',
        required: ['produtoId', 'fornecedorId', 'quantidade'],
        properties: {
          produtoId: { type: 'string' },
          fornecedorId: { type: 'string' },
          quantidade: { type: 'integer', minimum: 1 }
        }
      },
      response: {
        201: { type: 'object' }
      },
      security: [{ bearerAuth: [] }]
    }
  }, compraController.criar);


  fastify.patch<{ Params: { id: string }; Body: { status: StatusPedido } }>('/:id/status', {
    preHandler: autorizar([Cargo.ADMIN, Cargo.GERENTE]),
    schema: {
      tags: ['Compras'],
      summary: 'Atualizar status da compra',
      description: 'Atualiza o status de uma compra existente',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: Object.values(StatusPedido) }
        }
      },
      response: {
        200: { type: 'object' },
        400: { type: 'object', properties: { mensagem: { type: 'string' } } }
      },
      security: [{ bearerAuth: [] }]
    }
  }, compraController.atualizarStatus);

  fastify.delete<{ Params: { id: string } }>('/:id', {
    preHandler: autorizar([Cargo.ADMIN]),
    schema: {
      tags: ['Compras'],
      summary: 'Excluir compra',
      description: 'Exclui uma compra com base no ID informado',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        204: { description: 'Compra excluída com sucesso' },
        500: { type: 'object', properties: { mensagem: { type: 'string' } } }
      },
      security: [{ bearerAuth: [] }]
    }
  }, compraController.excluir);
}
