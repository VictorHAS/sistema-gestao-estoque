import { FastifyInstance, FastifyRequest } from 'fastify';
import { ProdutoController } from '../controllers/produto.controller';
import { autenticar, autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

// Interfaces para tipagem explícita
interface CriarProdutoRoute {
  Body: {
    nome: string;
    descricao?: string;
    codigo: string;
    preco: number;
    categoriaId: string;
  };
}

interface AtualizarProdutoRoute {
  Params: { id: string };
  Body: {
    nome?: string;
    descricao?: string;
    codigo?: string;
    preco?: number;
    categoriaId?: string;
  };
}

interface BuscarProdutoPorId {
  Params: { id: string };
}

interface BuscarProdutoPorNome {
  Params: { nome: string };
}

const produtoController = new ProdutoController();

export default async function (fastify: FastifyInstance) {
  fastify.addHook('preHandler', autenticar);

  fastify.get('/', {
    schema: {
      tags: ['Produtos'],
      summary: 'Listar produtos',
      description: 'Retorna todos os produtos cadastrados no sistema',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
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
              }
            }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, produtoController.listarTodos);

  fastify.get<BuscarProdutoPorId>('/:id', {
    schema: {
      tags: ['Produtos'],
      summary: 'Obter produto por ID',
      description: 'Retorna os dados de um produto específico',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID do produto' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                descricao: { type: 'string' },
                codigo: { type: 'string' },
                preco: { type: 'number' },
                categoriaId: { type: 'string' },
                dataCriacao: { type: 'string', format: 'date-time' },
                dataAtualizacao: { type: 'string', format: 'date-time' },
                categoria: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    nome: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, produtoController.obterPorId);

  fastify.get<BuscarProdutoPorNome>('/buscar/:nome', {
    schema: {
      tags: ['Produtos'],
      summary: 'Buscar produto por nome',
      description: 'Busca produtos cujo nome contenha o texto informado',
      params: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string', description: 'Nome parcial do produto' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  nome: { type: 'string' },
                  descricao: { type: 'string' },
                  codigo: { type: 'string' },
                  preco: { type: 'number' },
                  categoriaId: { type: 'string' },
                  categoria: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      nome: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, produtoController.buscarPorNome);

  fastify.post<CriarProdutoRoute>('/', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Produtos'],
      summary: 'Criar produto',
      description: 'Cadastra um novo produto',
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
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                descricao: { type: 'string' },
                codigo: { type: 'string' },
                preco: { type: 'number' },
                categoriaId: { type: 'string' },
                dataCriacao: { type: 'string', format: 'date-time' },
                dataAtualizacao: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, produtoController.criar);

  fastify.put<AtualizarProdutoRoute>('/:id', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Produtos'],
      summary: 'Atualizar produto',
      description: 'Atualiza os dados de um produto existente',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID do produto' }
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
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                descricao: { type: 'string' },
                codigo: { type: 'string' },
                preco: { type: 'number' },
                categoriaId: { type: 'string' },
                dataCriacao: { type: 'string', format: 'date-time' },
                dataAtualizacao: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, produtoController.atualizar);

  fastify.delete<BuscarProdutoPorId>('/:id', {
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      tags: ['Produtos'],
      summary: 'Excluir produto',
      description: 'Remove um produto do sistema',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID do produto' }
        }
      },
      response: {
        204: { description: 'Produto excluído com sucesso' }
      },
      security: [{ bearerAuth: [] }]
    }
  }, produtoController.excluir);
}
