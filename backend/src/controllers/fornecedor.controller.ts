import { FastifyRequest, FastifyReply } from 'fastify';
import { FornecedorService } from '../services/fornecedor.service';

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

// Helper de resposta padrão
const response = (success: boolean, message: string, data: any = null) => ({
  success,
  message,
  data,
});

export class FornecedorController {
  private fornecedorService = new FornecedorService();

  listarTodos = async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const fornecedores = await this.fornecedorService.listarTodos();
      reply.send(response(true, 'Lista de fornecedores', fornecedores));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao listar fornecedores'));
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
        return reply.status(404).send(response(false, 'Fornecedor não encontrado'));
      }
      reply.send(response(true, 'Fornecedor encontrado', fornecedor));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao obter fornecedor'));
    }
  };

  criar = async (
    request: FastifyRequest<{ Body: CriarFornecedorBody }>,
    reply: FastifyReply
  ) => {
    try {
      const novo = await this.fornecedorService.criar(request.body);
      reply.status(201).send(response(true, 'Fornecedor criado com sucesso', novo));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao criar fornecedor'));
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
        return reply.status(404).send(response(false, 'Fornecedor não encontrado para atualização'));
      }
      reply.send(response(true, 'Fornecedor atualizado com sucesso', atualizado));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao atualizar fornecedor'));
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
        return reply.status(404).send(response(false, 'Fornecedor não encontrado para exclusão'));
      }
      reply.status(204).send(); // sem corpo
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao excluir fornecedor'));
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
        return reply.status(400).send(response(false, 'Erro ao adicionar produto ao fornecedor'));
      }
      reply.send(response(true, 'Produto adicionado ao fornecedor com sucesso'));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao adicionar produto'));
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
        return reply.status(400).send(response(false, 'Erro ao remover produto do fornecedor'));
      }
      reply.send(response(true, 'Produto removido do fornecedor com sucesso'));
    } catch (err) {
      reply.status(500).send(response(false, 'Erro ao remover produto'));
    }
  };
}
