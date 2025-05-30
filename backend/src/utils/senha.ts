import bcrypt from 'bcrypt';

export async function hashSenha(senha: string): Promise<string> {
  return await bcrypt.hash(senha, 10);
}

export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(senha, hash);
}
