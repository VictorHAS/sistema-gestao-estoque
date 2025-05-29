import fastify, { FastifyInstance } from 'fastify';
import { PrismaClient } from './generated/prisma';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import { tratadorErros } from './middlewares/error.midleware';
import { opcoesSwagger, opcoesSwaggerUi } from './utils/swagger';

// Rotas
import rotasAutenticacao from './routes/autenticacao.routes';
import rotasUsuario from './routes/usuario.routes';
import rotasCategoria from './routes/categoria.routes';
import rotasProduto from './routes/produto.routes';
import rotasFornecedor from './routes/fornecedor.routes';
import rotasCompra from './routes/compra.routes';
import rotasVenda from './routes/venda.routes';
import rotasDeposito from './routes/deposito.routes';
import rotasEstoque from './routes/estoque.routes';


// Variáveis de ambiente
import { config } from './config/ambiente';

// Criar cliente Prisma
export const prisma = new PrismaClient();

// Criar servidor Fastify
const servidor: FastifyInstance = fastify({
  logger: true,
});


// Registrar plugins
servidor.register(fastifyHelmet);
servidor.register(fastifyJwt, {
  secret: config.jwtSecret,
});

servidor.register(fastifyCors, {
  origin: true,
});

servidor.register(fastifySwagger, opcoesSwagger);
servidor.register(fastifySwaggerUi, opcoesSwaggerUi);

// Registrar rotas
servidor.register(rotasAutenticacao, { prefix: '/api/auth' });
servidor.register(rotasUsuario, { prefix: '/api/usuarios' });
servidor.register(rotasCategoria, { prefix: '/api/categorias' });
servidor.register(rotasProduto, { prefix: '/api/produtos' });
servidor.register(rotasFornecedor, { prefix: '/api/fornecedores' });
servidor.register(rotasCompra, { prefix: '/api/compras' });
servidor.register(rotasVenda, { prefix: '/api/vendas' });
servidor.register(rotasDeposito, { prefix: '/api/depositos' });
servidor.register(rotasEstoque, { prefix: '/api/estoque' });

// Tratador de erros
servidor.setErrorHandler(tratadorErros);

// Rota de verificação de saúde
servidor.get('/health', async () => {
  return { status: 'ok' };
});


// Iniciar servidor
const iniciar = async () => {
  try {
    await servidor.listen({ port: config.porta, host: '0.0.0.0' });
    console.log(`Servidor rodando na porta ${config.porta}`);
  } catch (err) {
    servidor.log.error(err);
    process.exit(1);
  }
};


iniciar();
