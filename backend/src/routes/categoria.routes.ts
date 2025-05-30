import { FastifyInstance } from 'fastify';
import { CategoriaController } from '../controllers/categoria.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';
import { autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const categoriaController = new CategoriaController();

export default async function (fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todas as categorias ou buscar por nome
  fastify.get('/', {
    schema: {
      tags: ['Categorias'],
      summary: 'Listar categorias',
      description: 'Lista todas as categorias ou busca por nome',
      querystring: {
        type: 'object',
        properties: {
          nome: {
            type: 'string',
            description: 'Buscar categorias por nome (busca parcial)'
          }
        }
      },
      response: {
        200: {
          description: 'Lista de categorias',
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
                  dataCriacao: { type: 'string', format: 'date-time' },
                  dataAtualizacao: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        500: {
          description: 'Erro interno do servidor',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, categoriaController.listarOuBuscar);

  // Obter categoria por ID
  fastify.get('/:id', {
    schema: {
      tags: ['Categorias'],
      summary: 'Obter categoria por ID',
      description: 'Retorna os dados de uma categoria específica',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID da categoria'
          }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Dados da categoria',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                dataCriacao: { type: 'string', format: 'date-time' },
                dataAtualizacao: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Categoria não encontrada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        500: {
          description: 'Erro interno do servidor',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, categoriaController.obterPorId);

  // Criar categoria (apenas ADMIN e GERENTE)
  fastify.post('/', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Categorias'],
      summary: 'Criar categoria',
      description: 'Cria uma nova categoria (apenas ADMIN e GERENTE)',
      body: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: {
            type: 'string',
            description: 'Nome da categoria'
          }
        }
      },
      response: {
        201: {
          description: 'Categoria criada com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                dataCriacao: { type: 'string', format: 'date-time' },
                dataAtualizacao: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        400: {
          description: 'Categoria com este nome já existe',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        },
        500: {
          description: 'Erro interno do servidor',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, categoriaController.criar);

  // Atualizar categoria (apenas ADMIN e GERENTE)
  fastify.put('/:id', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Categorias'],
      summary: 'Atualizar categoria',
      description: 'Atualiza os dados de uma categoria (apenas ADMIN e GERENTE)',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID da categoria'
          }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: {
            type: 'string',
            description: 'Novo nome da categoria'
          }
        }
      },
      response: {
        200: {
          description: 'Categoria atualizada com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                dataCriacao: { type: 'string', format: 'date-time' },
                dataAtualizacao: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        400: {
          description: 'Já existe uma categoria com este nome',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        },
        404: {
          description: 'Categoria não encontrada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        500: {
          description: 'Erro interno do servidor',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, categoriaController.atualizar);

  // Excluir categoria (apenas ADMIN)
  fastify.delete('/:id', {
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      tags: ['Categorias'],
      summary: 'Excluir categoria',
      description: 'Exclui uma categoria do sistema (apenas ADMIN)',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID da categoria'
          }
        },
        required: ['id']
      },
      response: {
        204: {
          description: 'Categoria excluída com sucesso'
        },
        400: {
          description: 'Categoria possui produtos associados',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        },
        404: {
          description: 'Categoria não encontrada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        500: {
          description: 'Erro interno do servidor',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, categoriaController.excluir);
}
