import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

interface UserPayload {
  sub: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  iat: number;
  exp: number;
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new Error('Token missing');

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({ success: false, message: 'Unauthorized' });
  }
}
