import { FastifyInstance } from 'fastify';
import { EstoqueController } from '../controllers/estoque.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';
import { autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const estoqueController = new EstoqueController();

export default async function (fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todo o estoque
  fastify.get('/', estoqueController.listarTodos);

  // Obter item de estoque por ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, estoqueController.obterPorId);

  // Obter estoque por produto e depósito
  fastify.get('/produto/:produtoId/deposito/:depositoId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          produtoId: { type: 'string' },
          depositoId: { type: 'string' }
        }
      }
    }
  }, estoqueController.obterPorProdutoEDeposito);

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
        required: ['quantidade'],
        properties: {
          quantidade: { type: 'integer', minimum: 0 }
        }
      }
    }
  }, estoqueController.atualizar);

  // Adicionar ao estoque
  fastify.patch('/:id/adicionar', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE, Cargo.FUNCIONARIO])],
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
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
  }, estoqueController.adicionarEstoque);

  // Remover do estoque
  fastify.patch('/:id/remover', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE, Cargo.FUNCIONARIO])],
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
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
  }, estoqueController.removerEstoque);

  // Listar produtos com estoque baixo
  fastify.get('/baixo/:limite', {
    schema: {
      params: {
        type: 'object',
        properties: {
          limite: { type: 'integer', minimum: 1 }
        }
      }
    }
  }, estoqueController.listarProdutosComEstoqueBaixo);
}
