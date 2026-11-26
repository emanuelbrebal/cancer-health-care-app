// Figma: editar (385:1726) — formulário de edição com Cancelar/Salvar. PRD 02 (W02-4, W02-7, W02-9).
// Gênero só leitura (sem endpoint de gêneros, G4); D9: imagem em texto, sem upload.
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Formik, type FormikHelpers } from 'formik'
import { Plus, X } from 'lucide-react'
import { Button, CheckboxField, LiveRegion, PageLoader, Panel, TextField } from '@/components/ui'
import { cleanList, diffChanged, hasChanges, toIntOrNull, toTextOrNull } from '@/features/content/diff'
import { tabSingular, tabToKind } from '@/features/content/labels'
import { mediaSchema } from '@/features/content/schemas'
import type { MediaItem, MediaKind, MediaPayload } from '@/features/content/types'
import { useLoad } from '@/features/content/useLoad'
import { PageHeader } from '@/layouts/PageHeader'
import { paths, type ContentTab } from '@/routes/paths'
import { mediaService } from '@/services/content'
import { apiErrorMessage, apiStatus } from '@/services/errors'

type MediaTab = Exclude<ContentTab, 'lazer'>

interface Values {
  title: string
  isFree: boolean
  releaseYear: string
  whereToFind: string[]
  image_path: string
  author: string
  eduCapesLink: string
  page_count: string
  director: string
  duration: string
  externalLink: string
  showrunner: string
  seasons: string
  episodes: string
}

const DUPLICATE = 'Já existe um item com este título.'

const num = (n: number | null | undefined) => (n == null || n === 0 ? '' : String(n))

function toValues(item: MediaItem): Values {
  return {
    title: item.title,
    isFree: item.isFree,
    releaseYear: num(item.releaseYear),
    whereToFind: item.whereToFind ?? [],
    image_path: item.imagePath ?? '',
    author: item.author ?? '',
    eduCapesLink: item.eduCapesLink ?? '',
    // O mapper devolve 0 quando não há páginas: tratamos 0 como vazio.
    page_count: num(item.pageCount),
    director: item.director ?? '',
    duration: item.duration ?? '',
    externalLink: item.externalLink ?? '',
    showrunner: item.showrunner ?? '',
    seasons: num(item.seasons),
    episodes: num(item.episodes),
  }
}

// Só os campos do tipo; vazios viram null (limpar no banco) e números passam a inteiro.
function toPayload(kind: MediaKind, v: Values): MediaPayload {
  const common: MediaPayload = {
    title: v.title.trim(),
    isFree: v.isFree,
    releaseYear: toIntOrNull(v.releaseYear),
    whereToFind: cleanList(v.whereToFind),
    image_path: v.image_path.trim(),
  }
  if (kind === 'books') {
    return {
      ...common,
      author: v.author.trim(),
      eduCapesLink: toTextOrNull(v.eduCapesLink),
      page_count: toIntOrNull(v.page_count),
    }
  }
  if (kind === 'movies') {
    return {
      ...common,
      director: v.director.trim(),
      duration: v.duration.trim(),
      externalLink: toTextOrNull(v.externalLink),
    }
  }
  return {
    ...common,
    showrunner: toTextOrNull(v.showrunner),
    externalLink: toTextOrNull(v.externalLink),
    seasons: toIntOrNull(v.seasons),
    episodes: toIntOrNull(v.episodes),
  }
}

const isMediaTab = (t: string | undefined): t is MediaTab => t === 'livros' || t === 'filmes' || t === 'series'

export default function MediaEditPage() {
  const { tab, id } = useParams()
  if (!isMediaTab(tab) || !id) return <Navigate to={paths.contentTab('livros')} replace />
  return <MediaEdit key={`${tab}/${id}`} tab={tab} id={id} />
}

function MediaEdit({ tab, id }: { tab: MediaTab; id: string }) {
  const kind = tabToKind[tab]
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const { data, loading, error: loadError } = useLoad(`${kind}/${id}`, async () => {
    const [item, all] = await Promise.all([mediaService.get(kind, id), mediaService.list(kind)])
    return { item, all }
  })

  const backToList = (flash?: string) => navigate(paths.contentTab(tab), flash ? { state: { flash } } : undefined)

  async function submit(values: Values, helpers: FormikHelpers<Values>) {
    if (!data) return
    setError(null)
    setNotice(null)
    const payload = toPayload(kind, values)
    const changes = diffChanged(toPayload(kind, toValues(data.item)), payload)
    if (!hasChanges(changes)) {
      setNotice('Nenhuma alteração para salvar.')
      return
    }

    // Conferência antecipada contra os ativos; o backend responde 409 nos demais casos (ex.: inativos).
    const title = payload.title ?? ''
    const clash = data.all.some(
      (m) => m.id !== id && m.title.localeCompare(title, 'pt-BR', { sensitivity: 'base' }) === 0,
    )
    if (changes.title !== undefined && clash) {
      helpers.setFieldError('title', DUPLICATE)
      setError(DUPLICATE)
      return
    }

    try {
      await mediaService.update(kind, id, changes)
      backToList(`“${title}” atualizado.`)
    } catch (e) {
      // 409: título repetido, inclusive de item inativado; a mensagem vem do servidor.
      if (apiStatus(e) === 409) {
        const message = apiErrorMessage(e, DUPLICATE)
        helpers.setFieldError('title', message)
        setError(`${message} Confira também os itens inativados.`)
      } else {
        setError(apiErrorMessage(e, 'Não foi possível salvar.'))
      }
    }
  }

  return (
    <>
      <PageHeader title="Gerenciador de conteúdo" description="Livros, filmes e séries recomendados na área de Lazer do app." />
      <Panel title={`Editar ${tabSingular[tab]}`}>
        {loading ? (
          <PageLoader />
        ) : loadError || !data ? (
          <LiveRegion
            message={
              apiStatus(loadError) === 404
                ? 'Item não encontrado ou inativado.'
                : apiErrorMessage(loadError, 'Não foi possível carregar o item.')
            }
          />
        ) : (
          <Formik initialValues={toValues(data.item)} validationSchema={mediaSchema(kind)} onSubmit={submit}>
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => {
              const field = (name: keyof Values) => ({
                name,
                value: values[name] as string,
                onChange: handleChange,
                onBlur: handleBlur,
                error:
                  touched[name] || (name === 'title' && errors.title === DUPLICATE)
                    ? (errors[name] as string | undefined)
                    : undefined,
              })
              const places = values.whereToFind

              return (
                <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <TextField label="Título" maxLength={150} required {...field('title')} />

                  <dl className="grid gap-5 rounded-field bg-surface px-4 py-3 text-support md:grid-cols-2">
                    <div>
                      <dt className="text-ink-muted">Gênero</dt>
                      <dd className="font-medium text-ink">{data.item.genre}</dd>
                    </div>
                    {kind === 'books' && (
                      <div>
                        <dt className="text-ink-muted">Visitas no app</dt>
                        <dd className="font-medium text-ink">{data.item.visitCount ?? 0}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="grid gap-5 md:grid-cols-3">
                    <TextField label="Ano de lançamento" inputMode="numeric" {...field('releaseYear')} />
                    {kind === 'books' && (
                      <TextField label="Número de páginas" inputMode="numeric" {...field('page_count')} />
                    )}
                    {kind === 'series' && (
                      <>
                        <TextField label="Temporadas" inputMode="numeric" {...field('seasons')} />
                        <TextField label="Episódios" inputMode="numeric" {...field('episodes')} />
                      </>
                    )}
                  </div>

                  {kind === 'books' && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <TextField label="Autor(a)" maxLength={100} required {...field('author')} />
                      <TextField label="Link do eduCAPES" type="url" {...field('eduCapesLink')} />
                    </div>
                  )}
                  {kind === 'movies' && (
                    <div className="grid gap-5 md:grid-cols-3">
                      <TextField label="Direção" maxLength={120} required {...field('director')} />
                      <TextField label="Duração" placeholder="1h 45min" maxLength={120} required {...field('duration')} />
                      <TextField label="Link externo" type="url" {...field('externalLink')} />
                    </div>
                  )}
                  {kind === 'series' && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <TextField label="Showrunner" maxLength={100} {...field('showrunner')} />
                      <TextField label="Link externo" type="url" {...field('externalLink')} />
                    </div>
                  )}

                  <CheckboxField
                    label="Conteúdo gratuito"
                    name="isFree"
                    checked={values.isFree}
                    onChange={(e) => void setFieldValue('isFree', e.target.checked)}
                  />

                  <fieldset className="flex flex-col gap-3">
                    <legend className="mb-1 text-support font-medium text-ink">Onde encontrar</legend>
                    {places.length === 0 && <p className="text-note text-ink-muted">Nenhum local informado.</p>}
                    <ul className="flex flex-col gap-3">
                      {places.map((place, i) => (
                        <li key={i} className="flex items-end gap-2">
                          <TextField
                            label={`Local ${i + 1}`}
                            value={place}
                            onChange={(e) =>
                              void setFieldValue(
                                'whereToFind',
                                places.map((p, j) => (j === i ? e.target.value : p)),
                              )
                            }
                            placeholder="Ex.: Netflix, biblioteca municipal"
                            className="flex-1"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              void setFieldValue(
                                'whereToFind',
                                places.filter((_, j) => j !== i),
                              )
                            }
                            aria-label={`Remover local ${i + 1}${place ? ` (${place})` : ''}`}
                            className="mb-0.5 inline-flex size-11 items-center justify-center rounded-full text-danger hover:bg-danger-bg"
                          >
                            <X size={22} aria-hidden />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      icon={Plus}
                      onClick={() => void setFieldValue('whereToFind', [...places, ''])}
                      className="self-start"
                    >
                      Adicionar local
                    </Button>
                  </fieldset>

                  <TextField
                    label="Imagem de capa (caminho ou URL)"
                    hint="Conteúdo novo pode aparecer sem capa no app nesta versão; registre a fonte/licença da imagem."
                    {...field('image_path')}
                  />

                  <LiveRegion message={error} />
                  <LiveRegion tone="success" message={notice} />

                  <div className="flex flex-wrap justify-end gap-6">
                    <Button variant="danger-outline" onClick={() => backToList()} className="min-w-[170px]">
                      Cancelar
                    </Button>
                    <Button type="submit" loading={isSubmitting} className="min-w-[170px]">
                      Salvar
                    </Button>
                  </div>
                </form>
              )
            }}
          </Formik>
        )}
      </Panel>
    </>
  )
}
