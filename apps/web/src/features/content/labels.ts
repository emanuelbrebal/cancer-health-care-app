import type { ContentTab } from '@/routes/paths'
import type { Frequency, LeisureType, MediaKind } from './types'

// PRD 03 W03-5: o painel mostra o rótulo e envia o valor exato do enum
// (FORTWEEKLY e SPORADICAL estão assim no banco).
export const leisureTypeLabels: Record<LeisureType, string> = {
  PHYSICAL: 'Física',
  CULTURAL: 'Cultural',
  SOCIAL: 'Social',
  THERAPY: 'Terapêutica',
  RECREATIONAL: 'Recreativa',
  REST: 'Descanso',
}

export const frequencyLabels: Record<Frequency, string> = {
  DAILY: 'Diária',
  WEEKLY: 'Semanal',
  FORTWEEKLY: 'Quinzenal',
  MONTHLY: 'Mensal',
  SPORADICAL: 'Esporádica',
}

export const toOptions = <K extends string>(labels: Record<K, string>) =>
  (Object.keys(labels) as K[]).map((value) => ({ value, label: labels[value] }))

export const tabLabels: Record<ContentTab, string> = {
  livros: 'Livros',
  filmes: 'Filmes',
  series: 'Séries',
  lazer: 'Lazer',
}

export const tabToKind: Record<Exclude<ContentTab, 'lazer'>, MediaKind> = {
  livros: 'books',
  filmes: 'movies',
  series: 'series',
}

/** Singular, para títulos de página ("Editar livro"). */
export const tabSingular: Record<ContentTab, string> = {
  livros: 'livro',
  filmes: 'filme',
  series: 'série',
  lazer: 'atividade de lazer',
}
