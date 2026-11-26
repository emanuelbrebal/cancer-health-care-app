import { isAxiosError } from 'axios'

interface ApiErrorBody {
  statusCode?: number
  message?: string | string[]
  code?: string
}

export function apiStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined
}

export function apiCode(error: unknown): string | undefined {
  return isAxiosError<ApiErrorBody>(error) ? error.response?.data?.code : undefined
}

// Mensagens fixas do PRD 01 (W01-3, W01-9, W01-10) têm prioridade sobre o texto do backend.
export function apiErrorMessage(error: unknown, fallback = 'Não foi possível concluir a ação.'): string {
  if (!isAxiosError<ApiErrorBody>(error)) return fallback
  if (!error.response) return 'Não foi possível conectar ao servidor. Verifique sua conexão.'

  const { status, data } = error.response
  if (status === 429) return 'Muitas tentativas. Aguarde um minuto.'
  if (data?.code === 'ACCOUNT_SUSPENDED') return 'Conta suspensa.'
  if (data?.code === 'ADMIN_ONLY') return 'Acesso restrito a administradores.'
  if (status >= 500) return 'O servidor encontrou um erro. Tente novamente em instantes.'

  const message = Array.isArray(data?.message) ? data.message[0] : data?.message
  return message || fallback
}
