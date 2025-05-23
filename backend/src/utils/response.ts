import { FastifyReply } from 'fastify';

export class Response {
  static ok(reply: FastifyReply, data: any) {
    return reply.code(200).send({ success: true, data });
  }

  static created(reply: FastifyReply, data: any) {
    return reply.code(201).send({ success: true, data });
  }

  static noContent(reply: FastifyReply) {
    return reply.code(204).send();
  }

  static badRequest(reply: FastifyReply, message: string) {
    return reply.code(400).send({ success: false, message });
  }

  static unauthorized(reply: FastifyReply, message: string) {
    return reply.code(401).send({ success: false, message });
  }

  static notFound(reply: FastifyReply, message: string) {
    return reply.code(404).send({ success: false, message });
  }

  static internalError(reply: FastifyReply, message: string) {
    return reply.code(500).send({ success: false, message });
  }
}
