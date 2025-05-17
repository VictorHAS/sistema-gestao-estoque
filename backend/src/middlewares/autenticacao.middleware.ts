import { FastifyRequest, FastifyReply } from 'fastify';
import { Cargo } from '../generated/prisma';

interface UsuarioAutenticado {
  id: string;
  email: string;
  cargo: Cargo;
}

declare module 'fastify' {
  interface FastifyRequest {
    usuario: UsuarioAutenticado;
  }
}

export async function autenticar(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    request.usuario = request.user as UsuarioAutenticado;
  } catch (err) {
    reply.status(401).send({ error: 'Não autorizado' });
  }
}

export function autorizar(cargosPermitidos: Cargo[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { usuario } = request;

      if (!cargosPermitidos.includes(usuario.cargo)) {
        return reply.status(403).send({ error: 'Acesso proibido' });
      }
    } catch (err) {
      reply.status(401).send({ error: 'Não autorizado' });
    }
  };
}
