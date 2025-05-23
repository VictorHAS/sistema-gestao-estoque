import { createHash } from 'node:crypto';

export async function hashSenha(senha: string): Promise<string> {
  return await createHash('sha256').update(senha).digest('hex');
}

export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return await createHash('sha256').update(senha).digest('hex') === hash;
}
