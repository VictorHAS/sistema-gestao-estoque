import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      sub: string;
      email: string;
      role: string;
    };
  }

  interface FastifyInstance {
    authenticate: any;
  }
}
