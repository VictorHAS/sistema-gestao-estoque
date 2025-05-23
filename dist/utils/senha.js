import { createHash } from 'node:crypto';
export async function hashSenha(senha) {
    return await createHash('sha256').update(senha).digest('hex');
}
export async function verificarSenha(senha, hash) {
    return await createHash('sha256').update(senha).digest('hex') === hash;
}
