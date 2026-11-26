import { useCallback, useEffect, useState } from 'react'

interface LoadState<T> {
  key: string
  data?: T
  error?: unknown
}

/**
 * Carrega dados por chave. `loading` é derivado (chave pedida ≠ chave carregada), então não há
 * setState síncrono dentro do effect; respostas de uma chave antiga são descartadas.
 */
export function useLoad<T>(key: string, loader: () => Promise<T>) {
  const [version, setVersion] = useState(0)
  const [state, setState] = useState<LoadState<T>>({ key: '' })
  const requestKey = `${key}#${version}`

  useEffect(() => {
    let alive = true
    loader().then(
      (data) => alive && setState({ key: requestKey, data }),
      (error: unknown) => alive && setState({ key: requestKey, error }),
    )
    return () => {
      alive = false
    }
    // `loader` muda a cada render; a chave decide quando recarregar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const current = state.key === requestKey

  return {
    loading: !current,
    data: current ? state.data : undefined,
    error: current ? state.error : undefined,
    reload,
  }
}
