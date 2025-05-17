import { FastifyInstance } from 'fastify';
import { ProdutoController } from '../controllers/produto.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';
import { autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const produtoController = new ProdutoController();

export default async function (fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todos os produtos
  fastify.get('/', produtoController.listarTodos);

  // Obter produto por ID
  fastify.get('/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, produtoController.obterPorId);

  // Buscar produtos por nome
  fastify.get('/buscar/:nome', {
    schema: {
      params: {
        type: 'object',
        properties: {
          nome: { type: 'string' }
        }
      }
    }
  }, produtoController.buscarPorNome);

  // Criar produto (apenas ADMIN e GERENTE)
  fastify.post('/', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      body: {
        type: 'object',
        required: ['nome', 'codigo', 'preco', 'categoriaId'],
        properties: {
          nome: { type: 'string' },
          descricao: { type: 'string' },
          codigo: { type: 'string' },
          preco: { type: 'number' },
          categoriaId: { type: 'string' }
        }
      }
    }
  }, produtoController.criar);

  // Atualizar produto (apenas ADMIN e GERENTE)
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
          descricao: { type: 'string' },
          codigo: { type: 'string' },
          preco: { type: 'number' },
          categoriaId: { type: 'string' }
        }
      }
    }
  }, produtoController.atualizar);

  // Excluir produto (apenas ADMIN)
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
  }, produtoController.excluir);
}
