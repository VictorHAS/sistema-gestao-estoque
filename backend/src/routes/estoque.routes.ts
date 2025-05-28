import { FastifyInstance } from 'fastify';
import { EstoqueController } from '../controllers/estoque.controller';
import { autenticar, autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const estoqueController = new EstoqueController();

export interface AdicionarEstoqueRoute {
  Params: {
    produtoId: string;
    depositoId: string;
  };
  Body: {
    quantidade: number;
  };
}

export interface CriarEstoqueRoute {
  Body: {
    produtoId: string;
    depositoId: string;
    quantidade: number;
  };
}



export default async function estoqueRoutes(fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todo o estoque
  fastify.get('/', estoqueController.listarTodos);

  // Obter item de estoque por ID
  fastify.get(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
    },
    estoqueController.obterPorId
  );

  // Obter estoque por produto e depósito
  fastify.get(
    '/produto/:produtoId/deposito/:depositoId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            produtoId: { type: 'string' },
            depositoId: { type: 'string' },
          },
          required: ['produtoId', 'depositoId'],
        },
      },
    },
    estoqueController.obterPorProdutoEDeposito
  );

  // Criar item de estoque (apenas ADMIN e GERENTE)
  fastify.post('/', {
  preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
  schema: {
    body: {
      type: 'object',
      required: ['produtoId', 'depositoId', 'quantidade'],
      properties: {
        produtoId: { type: 'string' },
        depositoId: { type: 'string' },
        quantidade: { type: 'integer', minimum: 0 }
      }
    }
  }
}, estoqueController.criar);


  // Atualizar quantidade de estoque (apenas ADMIN e GERENTE)
  fastify.put(
    '/produto/:produtoId/deposito/:depositoId',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            produtoId: { type: 'string' },
            depositoId: { type: 'string' },
          },
          required: ['produtoId', 'depositoId'],
        },
        body: {
          type: 'object',
          required: ['quantidade'],
          properties: {
            quantidade: { type: 'integer', minimum: 0 },
          },
        },
      },
    },
    estoqueController.atualizarQuantidade
  );

  // Adicionar ao estoque
fastify.patch<AdicionarEstoqueRoute>(
  '/produto/:produtoId/deposito/:depositoId/adicionar',
  {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE, Cargo.FUNCIONARIO])],
    schema: {
      params: {
        type: 'object',
        required: ['produtoId', 'depositoId'],
        properties: {
          produtoId: { type: 'string' },
          depositoId: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['quantidade'],
        properties: {
          quantidade: { type: 'integer', minimum: 1 }
        }
      }
    }
  },
  estoqueController.adicionarEstoque
);

  // Remover do estoque
  fastify.patch(
    '/produto/:produtoId/deposito/:depositoId/remover',
    {
      preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE, Cargo.FUNCIONARIO])],
      schema: {
        params: {
          type: 'object',
          properties: {
            produtoId: { type: 'string' },
            depositoId: { type: 'string' },
          },
          required: ['produtoId', 'depositoId'],
        },
        body: {
          type: 'object',
          required: ['quantidade'],
          properties: {
            quantidade: { type: 'integer', minimum: 1 },
          },
        },
      },
    },
    estoqueController.remover
  );

  // Listar produtos com estoque baixo
  fastify.get(
    '/alerta-baixo',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            limite: { type: 'integer', minimum: 1 },
          },
        },
      },
    },
    estoqueController.verificarEstoqueBaixo
  );
}
