import { FastifyRequest, FastifyReply } from 'fastify';
import { FornecedorService } from '../services/fornecedor.service';
import { successResponse, errorResponse } from '../utils/response.helper';

interface ParamsWithId {
  id: string;
}

interface ProdutoFornecedorParams {
  fornecedorId: string;
  produtoId: string;
}

interface CriarFornecedorBody {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
}

interface AtualizarFornecedorBody {
  nome?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export class FornecedorController {
  private fornecedorService = new FornecedorService();

  listarTodos = async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const fornecedores = await this.fornecedorService.listarTodos();
      reply.send(successResponse('Lista de fornecedores obtida com sucesso', fornecedores));
    } catch (err) {
      console.error(err);
      reply.status(500).send(errorResponse('Erro ao listar fornecedores'));
    }
  };

  obterPorId = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const fornecedor = await this.fornecedorService.obterPorId(id);
      if (!fornecedor) {
        return reply.status(404).send(errorResponse('Fornecedor não encontrado'));
      }
      reply.send(successResponse('Fornecedor obtido com sucesso', fornecedor));
    } catch (err) {
      console.error(err);
      reply.status(500).send(errorResponse('Erro ao obter fornecedor'));
    }
  };

  criar = async (
    request: FastifyRequest<{ Body: CriarFornecedorBody }>,
    reply: FastifyReply
  ) => {
    try {
      const novo = await this.fornecedorService.criar(request.body);
      reply.status(201).send(successResponse('Fornecedor criado com sucesso', novo));
    } catch (err) {
      console.error(err);
      reply.status(500).send(errorResponse('Erro ao criar fornecedor'));
    }
  };

  atualizar = async (
    request: FastifyRequest<{ Params: ParamsWithId; Body: AtualizarFornecedorBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const atualizado = await this.fornecedorService.atualizar(id, request.body);
      if (!atualizado) {
        return reply.status(404).send(errorResponse('Fornecedor não encontrado para atualização'));
      }
      reply.send(successResponse('Atualização de fornecedor realizada com sucesso', atualizado));
    } catch (err) {
      console.error(err);
      reply.status(500).send(errorResponse('Erro ao atualizar fornecedor'));
    }
  };

  excluir = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const removido = await this.fornecedorService.excluir(id);
      if (!removido) {
        return reply.status(404).send(errorResponse('Fornecedor não encontrado para exclusão'));
      }
      reply.status(204).send(); // sem corpo, como exige o HTTP 204
    } catch (err) {
      console.error(err);
      reply.status(500).send(errorResponse('Erro ao excluir fornecedor'));
    }
  };

  adicionarProduto = async (
    request: FastifyRequest<{ Params: ProdutoFornecedorParams }>,
    reply: FastifyReply
  ) => {
    try {
      const { fornecedorId, produtoId } = request.params;
      const resultado = await this.fornecedorService.adicionarProduto(fornecedorId, produtoId);
      if (!resultado) {
        return reply.status(404).send(errorResponse('Fornecedor ou Produto não encontrado'));
      }
      reply.send(successResponse('Produto adicionado ao fornecedor com sucesso'));
    } catch (err) {
      console.error(err);
      reply.status(500).send(errorResponse('Erro ao adicionar produto ao fornecedor'));
    }
  };

  removerProduto = async (
    request: FastifyRequest<{ Params: ProdutoFornecedorParams }>,
    reply: FastifyReply
  ) => {
    try {
      const { fornecedorId, produtoId } = request.params;
      const resultado = await this.fornecedorService.removerProduto(fornecedorId, produtoId);
      if (!resultado) {
        return reply.status(404).send(errorResponse('Fornecedor ou Produto não encontrado'));
      }
      reply.send(successResponse('Produto removido do fornecedor com sucesso'));
    } catch (err) {
      console.error(err);
      reply.status(500).send(errorResponse('Erro ao remover produto do fornecedor'));
    }
  };
}
