import { PrismaClient, Cargo, StatusPedido } from '../src/generated/prisma';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash da senha (ex: senha123)
  const senhaHasheada = hashSync('senha123', 10);

  // Usuários
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Admin Principal',
      email: 'admin@sistema.com',
      senha: senhaHasheada,
      cargo: Cargo.ADMIN,
    },
  });

  const funcionario = await prisma.usuario.create({
    data: {
      nome: 'Funcionário João',
      email: 'joao@sistema.com',
      senha: senhaHasheada,
      cargo: Cargo.FUNCIONARIO,
    },
  });

  // Categorias
  const categoria1 = await prisma.categoria.create({ data: { nome: 'Eletrônicos' } });
  const categoria2 = await prisma.categoria.create({ data: { nome: 'Papelaria' } });

  // Produtos
  const produto1 = await prisma.produto.create({
    data: {
      nome: 'Notebook',
      codigo: 'NB001',
      preco: 4500.00,
      categoriaId: categoria1.id,
    },
  });

  const produto2 = await prisma.produto.create({
    data: {
      nome: 'Mouse Wireless',
      codigo: 'MSW001',
      preco: 120.00,
      categoriaId: categoria1.id,
    },
  });

  const produto3 = await prisma.produto.create({
    data: {
      nome: 'Caderno 100 folhas',
      codigo: 'CD100',
      preco: 15.00,
      categoriaId: categoria2.id,
    },
  });

  // Fornecedores
  const fornecedor1 = await prisma.fornecedor.create({
    data: {
      nome: 'Tech Supplies Ltda',
      email: 'contato@techsupplies.com',
      telefone: '11999999999',
      endereco: 'Av. das Inovações, 100',
    },
  });

  const fornecedor2 = await prisma.fornecedor.create({
    data: {
      nome: 'Papelaria Ideal',
      email: 'contato@papelariaideal.com',
      telefone: '11888888888',
      endereco: 'Rua dos Estudantes, 45',
    },
  });

  // Relacionar fornecedores aos produtos
  await prisma.produtoFornecedor.createMany({
    data: [
      { produtoId: produto1.id, fornecedorId: fornecedor1.id },
      { produtoId: produto2.id, fornecedorId: fornecedor1.id },
      { produtoId: produto3.id, fornecedorId: fornecedor2.id },
    ],
  });

  // Depósito
  const deposito = await prisma.deposito.create({
    data: {
      nome: 'Depósito Central',
      localizacao: 'Bloco A',
    },
  });

  // Estoque
  await prisma.estoque.createMany({
    data: [
      { produtoId: produto1.id, depositoId: deposito.id, quantidade: 10 },
      { produtoId: produto2.id, depositoId: deposito.id, quantidade: 25 },
      { produtoId: produto3.id, depositoId: deposito.id, quantidade: 50 },
    ],
  });

  // Compra
  const compra = await prisma.compra.create({
    data: {
      fornecedorId: fornecedor1.id,
      usuarioId: admin.id,
      valorTotal: 4620.00,
      status: StatusPedido.CONCLUIDO,
      itens: {  // Alterado de itensCompra para itens
        create: [
          { produtoId: produto1.id, quantidade: 1, precoUnitario: 4500.00 },
          { produtoId: produto2.id, quantidade: 1, precoUnitario: 120.00 },
        ],
      },
    },
  });

  // Venda
  const venda = await prisma.venda.create({
    data: {
      usuarioId: funcionario.id,
      valorTotal: 4635.00,
      status: StatusPedido.CONCLUIDO,
      itens: {  // Alterado de itens_venda para itens
        create: [
          { produtoId: produto1.id, quantidade: 1, precoUnitario: 4500.00 },
          { produtoId: produto3.id, quantidade: 1, precoUnitario: 15.00 },
          { produtoId: produto2.id, quantidade: 1, precoUnitario: 120.00 },
        ],
      },
    },
  });

  console.log('Seed realizado com sucesso');
}

main()
  .catch((e) => {
    console.error('Erro ao rodar seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
