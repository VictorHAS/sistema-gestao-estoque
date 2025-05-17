import { FastifyInstance } from 'fastify';
import { FornecedorController } from '../controllers/fornecedor.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';
import { autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const fornecedorController = new FornecedorController();

export default async function (fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todos os fornecedores
  fastify.get('/', fornecedorController.listarTodos);

  // Obter fornecedor por ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, fornecedorController.obterPorId);

  // Criar fornecedor (apenas ADMIN e GERENTE)
  fastify.post('/', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      body: {
        type: 'object',
        required: ['nome', 'email'],
        properties: {
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          telefone: { type: 'string' },
          endereco: { type: 'string' }
        }
      }
    }
  }, fornecedorController.criar);

  // Atualizar fornecedor (apenas ADMIN e GERENTE)
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
          email: { type: 'string', format: 'email' },
          telefone: { type: 'string' },
          endereco: { type: 'string' }
        }
      }
    }
  }, fornecedorController.atualizar);

  // Excluir fornecedor (apenas ADMIN)
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
  }, fornecedorController.excluir);

  // Adicionar produto ao fornecedor
  fastify.post('/:fornecedorId/produtos/:produtoId', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      params: {
        type: 'object',
        properties: {
          fornecedorId: { type: 'string' },
          produtoId: { type: 'string' }
        }
      }
    }
  }, fornecedorController.adicionarProduto);

  // Remover produto do fornecedor
  fastify.delete('/:fornecedorId/produtos/:produtoId', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      params: {
        type: 'object',
        properties: {
          fornecedorId: { type: 'string' },
          produtoId: { type: 'string' }
        }
      }
    }
  }, fornecedorController.removerProduto);
}
