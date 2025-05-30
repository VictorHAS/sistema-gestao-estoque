import { FastifyInstance, FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { VendaController } from '../controllers/venda.controller';
import { autenticar, autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const vendaController = new VendaController();

// Interfaces específicas
interface ObterOuExcluirVendaRoute extends RouteGenericInterface {
  Params: { id: string };
}

interface CriarVendaRoute extends RouteGenericInterface {
  Body: {
    itens: {
      produtoId: string;
      quantidade: number;
      precoUnitario: number;
    }[];
  };
}

interface AtualizarStatusRoute extends RouteGenericInterface {
  Params: { id: string };
  Body: {
    status: 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO';
  };
}

export default async function (fastify: FastifyInstance) {
  fastify.addHook('preHandler', autenticar);

  // Listar todas as vendas
  fastify.get('/', {
    schema: {
      tags: ['Vendas'],
      summary: 'Listar todas as vendas',
      description: 'Retorna todas as vendas registradas',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              dataVenda: { type: 'string', format: 'date-time' },
              valorTotal: { type: 'number' },
              status: { type: 'string', enum: ['PENDENTE', 'CONCLUIDO', 'CANCELADO'] },
              usuarioId: { type: 'string' },
              usuario: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  nome: { type: 'string' },
                  email: { type: 'string' }
                }
              },
              itens: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    produtoId: { type: 'string' },
                    quantidade: { type: 'integer' },
                    precoUnitario: { type: 'number' },
                    subtotal: { type: 'number' },
                    produto: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        nome: { type: 'string' },
                        codigo: { type: 'string' }
                      }
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
            mensagem: { type: 'string' },
            error: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    return vendaController.listarTodas(request, reply);
  });

  // Obter venda por ID
  fastify.get('/:id', {
    schema: {
      tags: ['Vendas'],
      summary: 'Obter venda por ID',
      description: 'Retorna os detalhes de uma venda específica',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID da venda' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            dataVenda: { type: 'string', format: 'date-time' },
            valorTotal: { type: 'number' },
            status: { type: 'string', enum: ['PENDENTE', 'CONCLUIDO', 'CANCELADO'] },
            usuarioId: { type: 'string' },
            usuario: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nome: { type: 'string' },
                email: { type: 'string' }
              }
            },
            itens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  produtoId: { type: 'string' },
                  quantidade: { type: 'integer' },
                  precoUnitario: { type: 'number' },
                  subtotal: { type: 'number' },
                  produto: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      nome: { type: 'string' },
                      codigo: { type: 'string' },
                      preco: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' }
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
  }, async (
    request: FastifyRequest<ObterOuExcluirVendaRoute>,
    reply: FastifyReply
  ) => {
    return vendaController.obterPorId(request, reply);
  });

  // Criar venda
  fastify.post('/', {
    schema: {
      tags: ['Vendas'],
      summary: 'Criar nova venda',
      description: 'Registra uma nova venda com os itens e valores',
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
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            dataVenda: { type: 'string', format: 'date-time' },
            valorTotal: { type: 'number' },
            status: { type: 'string', enum: ['PENDENTE', 'CONCLUIDO', 'CANCELADO'] },
            usuarioId: { type: 'string' },
            itens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  produtoId: { type: 'string' },
                  quantidade: { type: 'integer' },
                  precoUnitario: { type: 'number' },
                  subtotal: { type: 'number' }
                }
              }
            }
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
  }, async (
    request: FastifyRequest<CriarVendaRoute>,
    reply: FastifyReply
  ) => {
    return vendaController.criar(request, reply);
  });

  // Atualizar status da venda
  fastify.patch('/:id/status', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Vendas'],
      summary: 'Atualizar status da venda',
      description: 'Atualiza o status de uma venda existente',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID da venda' }
        }
      },
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['PENDENTE', 'CONCLUIDO', 'CANCELADO'],
            description: 'Novo status da venda'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            dataVenda: { type: 'string', format: 'date-time' },
            valorTotal: { type: 'number' },
            status: { type: 'string', enum: ['PENDENTE', 'CONCLUIDO', 'CANCELADO'] },
            usuarioId: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' }
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
  }, async (
    request: FastifyRequest<AtualizarStatusRoute>,
    reply: FastifyReply
  ) => {
    return vendaController.atualizarStatus(request, reply);
  });

  // Excluir venda
  fastify.delete('/:id', {
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      tags: ['Vendas'],
      summary: 'Excluir venda',
      description: 'Remove uma venda do sistema. Apenas administradores podem excluir.',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'ID da venda' }
        }
      },
      response: {
        204: { description: 'Venda excluída com sucesso' },
        404: {
          type: 'object',
          properties: {
            mensagem: { type: 'string' }
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
  }, async (
    request: FastifyRequest<ObterOuExcluirVendaRoute>,
    reply: FastifyReply
  ) => {
    return vendaController.excluir(request, reply);
  });
}
