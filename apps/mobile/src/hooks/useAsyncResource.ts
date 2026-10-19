import { useCallback, useEffect, useRef, useState } from 'react';
import { useUxDebugStore } from '../store/useUxDebugStore';

export type ResourceStatus = 'loading' | 'success' | 'error' | 'empty';

interface Options<T> {
  /** Define quando o resultado conta como vazio. Padrão: array sem itens. */
  isEmpty?: (data: T) => boolean;
  /** Valor usado quando o painel de debug força 'empty'. */
  emptyValue?: T;
}

/**
 * Busca assíncrona com os quatro estados de interface (carregando, sucesso, erro, vazio).
 * Respeita o estado forçado pelo painel de simulação (useUxDebugStore).
 */
export function useAsyncResource<T>(fetcher: () => Promise<T>, deps: unknown[] = [], options: Options<T> = {}) {
  const forced = useUxDebugStore((s) => s.forced);
  const [data, setData] = useState<T | undefined>(undefined);
  const [realStatus, setRealStatus] = useState<ResourceStatus>('loading');
  const [error, setError] = useState<unknown>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fetcherRef = useRef(fetcher);
  const isEmptyRef = useRef(options.isEmpty);
  // Mantém a versão mais recente do fetcher sem refazer a busca a cada render.
  useEffect(() => {
    fetcherRef.current = fetcher;
    isEmptyRef.current = options.isEmpty;
  });

  const load = useCallback(async (mode: 'initial' | 'refresh' | 'silent' = 'initial') => {
    if (mode === 'refresh') setRefreshing(true);
    else if (mode === 'initial') setRealStatus('loading');
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
      const empty = isEmptyRef.current
        ? isEmptyRef.current(result)
        : Array.isArray(result) && result.length === 0;
      setRealStatus(empty ? 'empty' : 'success');
    } catch (e) {
      setError(e);
      setRealStatus('error');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Busca de dados é exatamente o caso de uso de um effect: sincroniza com a API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // 'success' forçado mostra o resultado real (o painel não inventa dados).
  const status: ResourceStatus = forced === 'auto' || forced === 'success' ? realStatus : forced;

  const exposedData = forced === 'empty' ? options.emptyValue : data;

  return {
    status,
    data: exposedData,
    error: forced === 'error' ? new Error('Erro simulado pelo painel de estados') : error,
    reload: () => load('initial'),
    refresh: () => load('refresh'),
    /** Revalida sem mostrar skeleton (ex.: ao voltar de um formulário). */
    revalidate: () => load('silent'),
    refreshing,
    setData,
  };
}
