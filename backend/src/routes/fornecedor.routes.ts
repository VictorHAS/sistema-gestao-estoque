import { FastifyInstance, FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { FornecedorController } from '../controllers/fornecedor.controller';
import { autenticar, autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const fornecedorController = new FornecedorController();

// Tipagens de rota
interface CriarFornecedorRoute extends RouteGenericInterface {
  Body: {
    nome: string;
    email: string;
    telefone?: string;
    endereco?: string;
  };
}

interface AtualizarFornecedorRoute extends RouteGenericInterface {
  Params: { id: string };
  Body: {
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
  };
}

interface IdParamsRoute extends RouteGenericInterface {
  Params: { id: string };
}

interface ProdutoFornecedorParams extends RouteGenericInterface {
  Params: {
    fornecedorId: string;
    produtoId: string;
  };
}

export default async function (fastify: FastifyInstance) {
  fastify.addHook('preHandler', autenticar);

  fastify.get('/', {
    schema: {
      tags: ['Fornecedores'],
      summary: 'Listar fornecedores',
      description: 'Retorna todos os fornecedores cadastrados no sistema',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => fornecedorController.listarTodos(request, reply));

  fastify.get<IdParamsRoute>('/:id', {
    schema: {
      tags: ['Fornecedores'],
      summary: 'Obter fornecedor por ID',
      description: 'Retorna os dados de um fornecedor específico',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID do fornecedor' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => fornecedorController.obterPorId(request, reply));

  fastify.post<CriarFornecedorRoute>('/', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Fornecedores'],
      summary: 'Criar fornecedor',
      description: 'Cadastra um novo fornecedor no sistema',
      body: {
        type: 'object',
        required: ['nome', 'email'],
        properties: {
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          telefone: { type: 'string' },
          endereco: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => fornecedorController.criar(request, reply));

  fastify.put<AtualizarFornecedorRoute>('/:id', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Fornecedores'],
      summary: 'Atualizar fornecedor',
      description: 'Atualiza os dados de um fornecedor existente',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID do fornecedor' },
        },
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          telefone: { type: 'string' },
          endereco: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => fornecedorController.atualizar(request, reply));

  fastify.delete<IdParamsRoute>('/:id', {
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      tags: ['Fornecedores'],
      summary: 'Excluir fornecedor',
      description: 'Remove um fornecedor do sistema. Apenas administradores podem executar.',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID do fornecedor a ser excluído' },
        },
      },
      response: {
        204: { description: 'Fornecedor excluído com sucesso' },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => fornecedorController.excluir(request, reply));

  fastify.post<ProdutoFornecedorParams>('/:fornecedorId/produtos/:produtoId', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Fornecedores'],
      summary: 'Adicionar produto ao fornecedor',
      description: 'Vincula um produto a um fornecedor',
      params: {
        type: 'object',
        required: ['fornecedorId', 'produtoId'],
        properties: {
          fornecedorId: { type: 'string', description: 'ID do fornecedor' },
          produtoId: { type: 'string', description: 'ID do produto' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => fornecedorController.adicionarProduto(request, reply));

  fastify.delete<ProdutoFornecedorParams>('/:fornecedorId/produtos/:produtoId', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Fornecedores'],
      summary: 'Remover produto do fornecedor',
      description: 'Remove a relação entre um produto e um fornecedor',
      params: {
        type: 'object',
        required: ['fornecedorId', 'produtoId'],
        properties: {
          fornecedorId: { type: 'string', description: 'ID do fornecedor' },
          produtoId: { type: 'string', description: 'ID do produto' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => fornecedorController.removerProduto(request, reply));
}
