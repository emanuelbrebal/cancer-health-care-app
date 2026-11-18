import axios from 'axios';
import { resolveApiBaseUrl } from './resolveApiBaseUrl';
import { sessionStorage } from './sessionStorage';

// Cliente sem interceptors: as chamadas de sessão não podem disparar outro refresh.
// Este módulo não importa o store de auth para não criar dependência circular.
const http = axios.create({ baseURL: resolveApiBaseUrl(), timeout: 15000 });

export type RefreshResult =
  | { status: 'ok'; accessToken: string }
  | { status: 'expired' }
  | { status: 'offline' };

let inFlight: Promise<RefreshResult> | null = null;

async function doRefresh(): Promise<RefreshResult> {
  const refreshToken = await sessionStorage.get();
  if (!refreshToken) return { status: 'expired' };

  try {
    const { data } = await http.post('/auth/refresh', { refresh_token: refreshToken });
    await sessionStorage.set(data.refresh_token);
    return { status: 'ok', accessToken: data.access_token };
  } catch (error: any) {
    // Sem resposta = sem rede: a sessão pode continuar válida, não deslogar.
    if (!error?.response) return { status: 'offline' };
    await sessionStorage.clear();
    return { status: 'expired' };
  }
}

// Single-flight: várias requisições com 401 ao mesmo tempo compartilham uma única troca.
// O refresh token é de uso único; duas trocas concorrentes derrubariam a sessão.
export function refreshSession(): Promise<RefreshResult> {
  inFlight ??= doRefresh().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

export async function revokeSession(): Promise<void> {
  const refreshToken = await sessionStorage.get();
  await sessionStorage.clear();
  if (!refreshToken) return;
  try {
    await http.post('/auth/logout', { refresh_token: refreshToken });
  } catch {
    // Offline: o token local já foi apagado e o do servidor expira sozinho.
  }
}
