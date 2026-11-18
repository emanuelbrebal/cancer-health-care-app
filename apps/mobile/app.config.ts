import type { ConfigContext, ExpoConfig } from 'expo/config';

// Estende o app.json (que segue sendo a fonte da configuração estática) e só acrescenta a
// validação da URL da API nos builds de release. APP_ENV vem do perfil em eas.json.
const RELEASE_ENVS = ['preview', 'production'];
const PLACEHOLDER_HOST_SUFFIX = '.invalid';

function assertReleaseApiUrl(appEnv: string) {
  const raw = process.env.EXPO_PUBLIC_API_URL?.trim();
  const fail = (reason: string) => {
    throw new Error(
      `[app.config] Build "${appEnv}" sem URL de API válida: ${reason}. ` +
        'Defina EXPO_PUBLIC_API_URL no perfil do eas.json (ou em "eas env") com a URL pública do backend.',
    );
  };

  if (!raw) fail('EXPO_PUBLIC_API_URL não definida');

  let host: string;
  try {
    host = new URL(raw!).hostname;
  } catch {
    return fail(`"${raw}" não é uma URL`);
  }

  if (host === 'localhost' || host === '127.0.0.1' || host === '10.0.2.2') {
    fail(`"${raw}" aponta para a máquina local`);
  }
  if (host.endsWith(PLACEHOLDER_HOST_SUFFIX)) {
    fail(`"${raw}" ainda é o placeholder`);
  }
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = process.env.APP_ENV ?? 'development';
  if (RELEASE_ENVS.includes(appEnv)) assertReleaseApiUrl(appEnv);
  return config as ExpoConfig;
};
