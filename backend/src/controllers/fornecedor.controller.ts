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

export class FornecedorController {
  private fornecedorService: FornecedorService;

  constructor() {
    this.fornecedorService = new FornecedorService();
  }

  listarTodos = async (_request: FastifyRequest, reply: FastifyReply) => {
    const fornecedores = await this.fornecedorService.listarTodos();
    reply.send(fornecedores);
  };

  obterPorId = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const fornecedor = await this.fornecedorService.obterPorId(id);
    if (fornecedor) {
      reply.send(fornecedor);
    } else {
      reply.status(404).send({ message: 'Fornecedor não encontrado' });
    }
  };

  criar = async (
    request: FastifyRequest<{ Body: CriarFornecedorBody }>,
    reply: FastifyReply
  ) => {
    const novoFornecedor = await this.fornecedorService.criar(request.body);
    reply.status(201).send(novoFornecedor);
  };

  atualizar = async (
    request: FastifyRequest<{ Params: ParamsWithId; Body: AtualizarFornecedorBody }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const atualizado = await this.fornecedorService.atualizar(id, request.body);
    if (atualizado) {
      reply.send(atualizado);
    } else {
      reply.status(404).send({ message: 'Fornecedor não encontrado para atualização' });
    }
  };

  excluir = async (
    request: FastifyRequest<{ Params: ParamsWithId }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const removido = await this.fornecedorService.excluir(id);
    if (removido) {
      reply.status(204).send();
    } else {
      reply.status(404).send({ message: 'Fornecedor não encontrado para exclusão' });
    }
  };

  adicionarProduto = async (
    request: FastifyRequest<{ Params: ProdutoFornecedorParams }>,
    reply: FastifyReply
  ) => {
    const { fornecedorId, produtoId } = request.params;
    const resultado = await this.fornecedorService.adicionarProduto(fornecedorId, produtoId);
    if (resultado) {
      reply.send({ message: 'Produto adicionado ao fornecedor com sucesso' });
    } else {
      reply.status(400).send({ message: 'Erro ao adicionar produto ao fornecedor' });
    }
  };

  removerProduto = async (
    request: FastifyRequest<{ Params: ProdutoFornecedorParams }>,
    reply: FastifyReply
  ) => {
    const { fornecedorId, produtoId } = request.params;
    const resultado = await this.fornecedorService.removerProduto(fornecedorId, produtoId);
    if (resultado) {
      reply.send({ message: 'Produto removido do fornecedor com sucesso' });
    } else {
      reply.status(400).send({ message: 'Erro ao remover produto do fornecedor' });
    }
  };
}
