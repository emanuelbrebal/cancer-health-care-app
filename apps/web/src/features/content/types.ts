// Formatos devolvidos pelos mappers do backend (BookMapper, MovieMapper, SeriesMapper,
// LeisureMapper). Atenção: a resposta usa `imagePath`/`pageCount`, mas o corpo de escrita usa
// `image_path`/`page_count` (DTOs). As rotas públicas não trazem `updatedAt` nem `genreId`; as
// rotas `/admin/*` trazem (AdminMediaItem / AdminLeisureItem).

export type MediaKind = 'books' | 'movies' | 'series'

export type ContentStatus = 'ACTIVE' | 'INACTIVE'
export type GenreType = 'BOOK' | 'MOVIE' | 'SERIES'

/** `GET /genres?type=` (público, só ativos). */
export interface Genre {
  id: string
  name: string
  type: GenreType
}

/** `GET /admin/genres` — inclui inativos e o total de itens ativos que usam o gênero. */
export interface AdminGenre extends Genre {
  status: ContentStatus
  activeItems: number
}

/** Resposta paginada das listas `/admin/*`. */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export type LeisureType = 'PHYSICAL' | 'CULTURAL' | 'SOCIAL' | 'THERAPY' | 'RECREATIONAL' | 'REST'
export type Frequency = 'DAILY' | 'WEEKLY' | 'FORTWEEKLY' | 'MONTHLY' | 'SPORADICAL'

export interface MediaItem {
  id: string
  title: string
  type: 'BOOK' | 'MOVIE' | 'SERIES'
  releaseYear: number | null
  status: string
  isFree: boolean
  whereToFind: string[]
  imagePath: string
  genre: string
  synopsis: string | null
  // Livro
  author?: string
  eduCapesLink?: string | null
  visitCount?: number
  pageCount?: number
  // Filme
  director?: string | null
  duration?: string | null
  // Filme e série
  externalLink?: string | null
  // Série
  showrunner?: string | null
  seasons?: number | null
  episodes?: number | null
}

export interface LeisureItem {
  id: string
  name: string
  type: LeisureType
  frequency: Frequency
  imagePath: string
  synopsis: string | null
  status: string
}

interface AdminStamps {
  createdAt: string
  updatedAt: string
}

export interface AdminMediaItem extends MediaItem, AdminStamps {
  genreId: string
}

export type AdminLeisureItem = LeisureItem & AdminStamps

/** Corpo de escrita (DTO) da mídia; só campos editáveis pelo painel nesta versão. */
export interface MediaPayload {
  title?: string
  isFree?: boolean
  releaseYear?: number | null
  whereToFind?: string[]
  image_path?: string
  author?: string
  eduCapesLink?: string | null
  page_count?: number | null
  director?: string | null
  duration?: string | null
  externalLink?: string | null
  showrunner?: string | null
  seasons?: number | null
  episodes?: number | null
}

export interface LeisurePayload {
  name: string
  type: LeisureType
  frequency: Frequency
  image_path: string
}
