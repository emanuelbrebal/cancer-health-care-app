import * as Yup from 'yup'
import type { MediaKind } from './types'
import { frequencyLabels, leisureTypeLabels } from './labels'

// Espelha os DTOs do backend (class-validator). Título limitado a 150 (coluna VarChar(150)),
// embora o DTO aceite 200 (PRD 02).
const optionalUrl = Yup.string()
  .trim()
  .test('url', 'Informe um endereço válido (https://…).', (v) => !v || /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v))

const optionalInt = (label: string) =>
  Yup.string()
    .trim()
    .test('int', `${label} precisa ser um número inteiro.`, (v) => !v || /^\d+$/.test(v))

export const leisureSchema = Yup.object({
  name: Yup.string().trim().required('Informe o nome.').max(150, 'Use até 150 caracteres.'),
  type: Yup.string()
    .required('Escolha o tipo.')
    .oneOf(Object.keys(leisureTypeLabels), 'Escolha o tipo.'),
  frequency: Yup.string()
    .required('Escolha a frequência.')
    .oneOf(Object.keys(frequencyLabels), 'Escolha a frequência.'),
  image_path: Yup.string().trim(),
})

export function mediaSchema(kind: MediaKind) {
  const base = {
    title: Yup.string().trim().required('Informe o título.').max(150, 'Use até 150 caracteres.'),
    isFree: Yup.boolean(),
    releaseYear: optionalInt('O ano').test(
      'year',
      'Informe um ano entre 1000 e 2100.',
      (v) => !v || (Number(v) >= 1000 && Number(v) <= 2100),
    ),
    image_path: Yup.string().trim(),
    whereToFind: Yup.array(Yup.string()),
  }
  if (kind === 'books') {
    return Yup.object({
      ...base,
      author: Yup.string().trim().required('Informe o autor.').max(100, 'Use até 100 caracteres.'),
      eduCapesLink: optionalUrl,
      page_count: optionalInt('O número de páginas'),
    })
  }
  if (kind === 'movies') {
    return Yup.object({
      ...base,
      director: Yup.string().trim().required('Informe a direção.').max(120, 'Use até 120 caracteres.'),
      duration: Yup.string().trim().required('Informe a duração (ex.: 1h 45min).').max(120, 'Use até 120 caracteres.'),
      externalLink: optionalUrl,
    })
  }
  return Yup.object({
    ...base,
    showrunner: Yup.string().trim().max(100, 'Use até 100 caracteres.'),
    externalLink: optionalUrl,
    seasons: optionalInt('O número de temporadas'),
    episodes: optionalInt('O número de episódios'),
  })
}
