import { FastifyInstance } from 'fastify';
import { UsuarioController } from '../controllers/usuario.controller';
import { autenticar } from '../middlewares/autenticacao.middleware';
import { autorizar } from '../middlewares/autenticacao.middleware';
import { Cargo } from '../generated/prisma';

const usuarioController = new UsuarioController();

export default async function (fastify: FastifyInstance) {
  // Middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', autenticar);

  // Listar todos os usuários ou filtrar por nome/cargo (apenas ADMIN e GERENTE)
  fastify.get('/', {
    preHandler: [autorizar([Cargo.ADMIN, Cargo.GERENTE])],
    schema: {
      tags: ['Usuários'],
      summary: 'Listar usuários',
      description: 'Lista todos os usuários ou filtra por nome e/ou cargo',
      querystring: {
        type: 'object',
        properties: {
          nome: {
            type: 'string',
            description: 'Filtrar usuários por nome (busca parcial)'
          },
          cargo: {
            type: 'string',
            enum: ['ADMIN', 'GERENTE', 'FUNCIONARIO'],
            description: 'Filtrar usuários por cargo'
          }
        }
      },
      response: {
        200: {
          description: 'Lista de usuários',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              nome: { type: 'string' },
              cargo: { type: 'string', enum: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] },
              dataCriacao: { type: 'string', format: 'date-time' },
              dataAtualizacao: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, usuarioController.listarOuFiltrar);

  // Obter usuário por ID
  fastify.get('/:id', {
    schema: {
      tags: ['Usuários'],
      summary: 'Obter usuário por ID',
      description: 'Retorna os dados de um usuário específico',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID do usuário'
          }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Dados do usuário',
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            nome: { type: 'string' },
            cargo: { type: 'string', enum: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          description: 'Usuário não encontrado',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, usuarioController.obterPorId);

  // Criar usuário (apenas ADMIN)
  fastify.post('/', {
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      tags: ['Usuários'],
      summary: 'Criar usuário',
      description: 'Cria um novo usuário no sistema (apenas ADMIN)',
      body: {
        type: 'object',
        required: ['email', 'senha', 'nome'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário'
          },
          senha: {
            type: 'string',
            minLength: 6,
            description: 'Senha do usuário (mínimo 6 caracteres)'
          },
          nome: {
            type: 'string',
            description: 'Nome completo do usuário'
          },
          cargo: {
            type: 'string',
            enum: ['ADMIN', 'GERENTE', 'FUNCIONARIO'],
            description: 'Cargo do usuário (padrão: FUNCIONARIO)'
          }
        }
      },
      response: {
        201: {
          description: 'Usuário criado com sucesso',
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            nome: { type: 'string' },
            cargo: { type: 'string', enum: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          description: 'Dados inválidos ou email já existe',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, usuarioController.criar);

  // Atualizar usuário (apenas ADMIN ou o próprio usuário)
  fastify.put('/:id', {
    schema: {
      tags: ['Usuários'],
      summary: 'Atualizar usuário',
      description: 'Atualiza os dados de um usuário (ADMIN pode atualizar qualquer usuário, outros apenas a si mesmos)',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID do usuário'
          }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Novo email do usuário'
          },
          nome: {
            type: 'string',
            description: 'Novo nome do usuário'
          },
          cargo: {
            type: 'string',
            enum: ['ADMIN', 'GERENTE', 'FUNCIONARIO'],
            description: 'Novo cargo do usuário'
          }
        }
      },
      response: {
        200: {
          description: 'Usuário atualizado com sucesso',
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            nome: { type: 'string' },
            cargo: { type: 'string', enum: ['ADMIN', 'GERENTE', 'FUNCIONARIO'] },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          description: 'Dados inválidos ou email já existe',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Usuário não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, usuarioController.atualizar);

  // Atualizar senha (apenas o próprio usuário)
  fastify.patch('/:id/senha', {
    schema: {
      tags: ['Usuários'],
      summary: 'Atualizar senha',
      description: 'Atualiza a senha de um usuário (apenas o próprio usuário pode alterar sua senha)',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID do usuário'
          }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        required: ['senhaAtual', 'novaSenha'],
        properties: {
          senhaAtual: {
            type: 'string',
            description: 'Senha atual do usuário'
          },
          novaSenha: {
            type: 'string',
            minLength: 6,
            description: 'Nova senha (mínimo 6 caracteres)'
          }
        }
      },
      response: {
        200: {
          description: 'Senha atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Senha atual incorreta',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Usuário não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, usuarioController.atualizarSenha);

  // Excluir usuário (apenas ADMIN)
  fastify.delete('/:id', {
    preHandler: [autorizar([Cargo.ADMIN])],
    schema: {
      tags: ['Usuários'],
      summary: 'Excluir usuário',
      description: 'Exclui um usuário do sistema (apenas ADMIN)',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID do usuário'
          }
        },
        required: ['id']
      },
      response: {
        204: {
          description: 'Usuário excluído com sucesso',
          type: 'null'
        },
        400: {
          description: 'Usuário possui compras ou vendas associadas',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Usuário não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, usuarioController.excluir);
}
