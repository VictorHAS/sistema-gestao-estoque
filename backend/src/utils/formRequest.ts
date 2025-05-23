import { ZodSchema } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';

export function validate(schema: ZodSchema<any>) {
  return (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    try {
      schema.parse(request.body);
      done();
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
  };
}
