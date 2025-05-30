import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface
} from 'fastify';
import { EstoqueController } from '../controllers/estoque.controller';
import { autenticar, autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const estoqueController = new EstoqueController();

// Tipagens personalizadas
interface IdParamsRoute extends RouteGenericInterface {
  Params: { id: string };
}

interface ProdutoDepositoParams extends RouteGenericInterface {
  Params: {
    produtoId: string;
    depositoId: string;
  };
}

interface QuantidadeBody extends RouteGenericInterface {
  Body: {
    quantidade: number;
  };
}

interface ProdutoDepositoQuantidadeRoute extends RouteGenericInterface {
  Params: {
    produtoId: string;
    depositoId: string;
  };
  Body: {
    quantidade: number;
  };
}

interface CriarEstoqueRoute extends RouteGenericInterface {
  Body: {
    produtoId: string;
    depositoId: string;
    quantidade: number;
  };
}

interface AlertaEstoqueQuery extends RouteGenericInterface {
  Querystring: {
    limite?: number;
  };
}

export default async function estoqueRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', autenticar);

  fastify.get('/', {
    schema: {
      tags: ['Estoque'],
      summary: 'Listar todo o estoque',
      description: 'Retorna todos os registros de estoque cadastrados',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              quantidade: { type: 'integer' },
              produtoId: { type: 'string' },
              depositoId: { type: 'string' },
              dataCriacao: { type: 'string', format: 'date-time' },
              dataAtualizacao: { type: 'string', format: 'date-time' },
              produto: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  nome: { type: 'string' },
                  codigo: { type: 'string' },
                  preco: { type: 'number' },
                  categoria: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      nome: { type: 'string' }
                    }
                  }
                }
              },
              deposito: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  nome: { type: 'string' },
                  localizacao: { type: 'string' }
                }
              }
            }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => estoqueController.listarTodos(request, reply));

  fastify.get<IdParamsRoute>('/:id', {
    schema: {
      tags: ['Estoque'],
      summary: 'Obter estoque por ID',
      description: 'Retorna um item de estoque pelo seu ID',
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            quantidade: { type: 'integer' },
            produtoId: { type: 'string' },
            depositoId: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' },
            produto: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                codigo: { type: 'string' },
                preco: { type: 'number' },
                categoria: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    nome: { type: 'string' }
                  }
                }
              }
            },
            deposito: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                localizacao: { type: 'string' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => estoqueController.obterPorId(request, reply));

  fastify.get<ProdutoDepositoParams>('/produto/:produtoId/deposito/:depositoId', {
    schema: {
      tags: ['Estoque'],
      summary: 'Obter estoque por produto e depósito',
      description: 'Busca um item de estoque específico por produto e depósito',
      params: {
        type: 'object',
        required: ['produtoId', 'depositoId'],
        properties: {
          produtoId: { type: 'string' },
          depositoId: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            quantidade: { type: 'integer' },
            produtoId: { type: 'string' },
            depositoId: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' },
            produto: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                codigo: { type: 'string' },
                preco: { type: 'number' }
              }
            },
            deposito: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                localizacao: { type: 'string' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => estoqueController.obterPorProdutoEDeposito(request, reply));

  fastify.post<CriarEstoqueRoute>('/', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Estoque'],
      summary: 'Criar item de estoque',
      description: 'Cria um novo registro de estoque',
      body: {
        type: 'object',
        required: ['produtoId', 'depositoId', 'quantidade'],
        properties: {
          produtoId: { type: 'string' },
          depositoId: { type: 'string' },
          quantidade: { type: 'integer', minimum: 0 }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            quantidade: { type: 'integer' },
            produtoId: { type: 'string' },
            depositoId: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => estoqueController.criar(request, reply));

  fastify.put<ProdutoDepositoQuantidadeRoute>('/produto/:produtoId/deposito/:depositoId', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Estoque'],
      summary: 'Atualizar quantidade em estoque',
      description: 'Atualiza diretamente a quantidade de um item de estoque específico',
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
          quantidade: { type: 'integer', minimum: 0 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            quantidade: { type: 'integer' },
            produtoId: { type: 'string' },
            depositoId: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => estoqueController.atualizarQuantidade(request, reply));

  fastify.patch<ProdutoDepositoQuantidadeRoute>('/produto/:produtoId/deposito/:depositoId/adicionar', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE, Cargo.FUNCIONARIO])],
    schema: {
      tags: ['Estoque'],
      summary: 'Adicionar ao estoque',
      description: 'Adiciona uma quantidade a um item de estoque já existente',
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
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            quantidade: { type: 'integer' },
            produtoId: { type: 'string' },
            depositoId: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => estoqueController.adicionarEstoque(request, reply));

  fastify.patch<ProdutoDepositoQuantidadeRoute>('/produto/:produtoId/deposito/:depositoId/remover', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE, Cargo.FUNCIONARIO])],
    schema: {
      tags: ['Estoque'],
      summary: 'Remover do estoque',
      description: 'Remove uma quantidade de um item de estoque específico',
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
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            quantidade: { type: 'integer' },
            produtoId: { type: 'string' },
            depositoId: { type: 'string' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => estoqueController.remover(request, reply));
}
