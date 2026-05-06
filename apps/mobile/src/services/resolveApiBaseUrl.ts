import Constants from 'expo-constants';

const DEFAULT_PORT = 3000;

function hostFromExpoDev(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return null;
  const host = hostUri.split(':')[0];
  return host || null;
}

function isLoopback(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * URL base da API. Em __DEV__, se EXPO_PUBLIC_API_URL apontar para localhost mas o app estiver
 * em um dispositivo físico (Metro expõe hostUri com IP da LAN), usa esse IP — caso contrário
 * o Axios falha sem response e o login mostra "Sem conexão".
 */
export function resolveApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  const fallback = `http://localhost:${DEFAULT_PORT}`;
  const devHost = hostFromExpoDev();

  if (__DEV__ && devHost) {
    const inferred = `http://${devHost}:${DEFAULT_PORT}`;
    if (!fromEnv) return inferred;

    try {
      const u = new URL(fromEnv);
      if (isLoopback(u.hostname) && !isLoopback(devHost)) {
        return inferred;
      }
    } catch {
      /* URL inválida no .env — segue para usar fromEnv ou fallback */
    }
  }

  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (__DEV__ && devHost) return `http://${devHost}:${DEFAULT_PORT}`;
  return fallback;
}
