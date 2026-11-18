import { createHmac } from 'crypto';

// Pseudonimização (LGPD art. 13 §4º): troca o identificador do usuário por um HMAC.
// Sem a chave, que fica só no ambiente do servidor, não dá para voltar à pessoa.
// Usado em registros que não precisam saber quem é o titular: auditoria do diário,
// conversas com o mascote e registro de exclusão de conta.
export function pseudonymize(userId: string): string {
  // Fallback para o JWT_SECRET só fora de produção; em produção o bootstrap exige a chave própria.
  const key =
    process.env.PSEUDONYM_KEY ||
    (process.env.NODE_ENV === 'production'
      ? undefined
      : process.env.JWT_SECRET);
  if (!key) {
    throw new Error('PSEUDONYM_KEY não definido.');
  }
  return createHmac('sha256', key).update(userId).digest('hex');
}
