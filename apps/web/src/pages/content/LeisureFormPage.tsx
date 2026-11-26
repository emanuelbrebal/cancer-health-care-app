// Figma: adc conteudo (40:1063) — cadastro; editar (385:1726) — edição. PRD 03 (W03-3/4/5/6).
// D9: sem upload (image_path em texto, R3).
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Formik, type FormikHelpers } from 'formik'
import { Alert, Button, FocusFirstError, LiveRegion, PageLoader, Panel, SelectField, TextField } from '@/components/ui'
import { diffChanged, hasChanges } from '@/features/content/diff'
import { frequencyLabels, leisureTypeLabels, toOptions } from '@/features/content/labels'
import { leisureSchema } from '@/features/content/schemas'
import type { Frequency, LeisureItem, LeisurePayload, LeisureType } from '@/features/content/types'
import { useLoad } from '@/features/content/useLoad'
import { PageHeader } from '@/layouts/PageHeader'
import { paths } from '@/routes/paths'
import { leisureService } from '@/services/content'
import { apiErrorMessage, apiStatus } from '@/services/errors'

interface Values {
  name: string
  type: LeisureType | ''
  frequency: Frequency | ''
  image_path: string
}

const DUPLICATE = 'Já existe uma atividade com este nome.'
const empty: Values = { name: '', type: '', frequency: '', image_path: '' }

// `image_path` vai sempre como string: a coluna é obrigatória e o repositório de lazer não
// aplica valor padrão (sem ele o backend responde 500).
function toPayload(v: Values): LeisurePayload {
  return {
    name: v.name.trim(),
    type: v.type as LeisureType,
    frequency: v.frequency as Frequency,
    image_path: v.image_path.trim(),
  }
}

const toValues = (item: LeisureItem): Values => ({
  name: item.name,
  type: item.type,
  frequency: item.frequency,
  image_path: item.imagePath ?? '',
})

const sameName = (a: string, b: string) =>
  a.trim().localeCompare(b.trim(), 'pt-BR', { sensitivity: 'base' }) === 0

export default function LeisureFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = !!id
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const { data, loading, error: loadError } = useLoad(id ?? 'new', async () => {
    const [item, all] = await Promise.all([id ? leisureService.get(id) : Promise.resolve(null), leisureService.list()])
    return { item, all }
  })

  const backToList = (flash?: string) =>
    navigate(paths.contentTab('lazer'), flash ? { state: { flash } } : undefined)

  async function submit(values: Values, helpers: FormikHelpers<Values>) {
    setError(null)
    setNotice(null)
    const payload = toPayload(values)

    // Conferência antecipada contra as ativas; o backend responde 409 nos demais casos (ex.: inativas).
    if (data?.all.some((l) => l.id !== id && sameName(l.name, payload.name))) {
      helpers.setFieldError('name', DUPLICATE)
      setError(DUPLICATE)
      return
    }

    try {
      if (editing && data?.item) {
        const changes = diffChanged(toPayload(toValues(data.item)), payload)
        if (!hasChanges(changes)) {
          setNotice('Nenhuma alteração para salvar.')
          return
        }
        await leisureService.update(id, changes)
        backToList(`Atividade “${payload.name}” atualizada.`)
      } else {
        await leisureService.create(payload)
        backToList(`Atividade “${payload.name}” cadastrada.`)
      }
    } catch (e) {
      // 409: nome repetido, inclusive de atividade inativada; a mensagem vem do servidor.
      if (apiStatus(e) === 409) {
        const message = apiErrorMessage(e, DUPLICATE)
        helpers.setFieldError('name', message)
        setError(`${message} Confira também as atividades inativadas.`)
      } else {
        setError(apiErrorMessage(e, 'Não foi possível salvar a atividade.'))
      }
    }
  }

  const title = editing ? 'Editar atividade de lazer' : 'Cadastro de atividade de lazer'

  return (
    <>
      <PageHeader title="Gerenciador de conteúdo" description="Atividades de lazer sugeridas na área Oncológica do app." />
      <Panel title={title}>
        {loading ? (
          <PageLoader />
        ) : loadError ? (
          <LiveRegion
            message={
              apiStatus(loadError) === 404
                ? 'Atividade não encontrada ou inativada.'
                : apiErrorMessage(loadError, 'Não foi possível carregar a atividade.')
            }
          />
        ) : (
          <Formik
            initialValues={data?.item ? toValues(data.item) : empty}
            validationSchema={leisureSchema}
            onSubmit={submit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
                <FocusFirstError />
                <Alert tone="info">
                  Esta atividade é uma sugestão geral e não substitui a orientação da equipe de saúde.
                </Alert>

                <TextField
                  label="Nome"
                  name="name"
                  maxLength={150}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name || errors.name === DUPLICATE ? errors.name : undefined}
                  required
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Tipo"
                    name="type"
                    placeholder="Selecione"
                    options={toOptions(leisureTypeLabels)}
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.type ? errors.type : undefined}
                    required
                  />
                  <SelectField
                    label="Frequência"
                    name="frequency"
                    placeholder="Selecione"
                    options={toOptions(frequencyLabels)}
                    value={values.frequency}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.frequency ? errors.frequency : undefined}
                    required
                  />
                </div>

                <TextField
                  label="Imagem (caminho ou URL)"
                  name="image_path"
                  hint="Opcional. Sem imagem, o app mostra a ilustração padrão; registre a fonte/licença da imagem."
                  value={values.image_path}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.image_path ? errors.image_path : undefined}
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
            )}
          </Formik>
        )}
      </Panel>
    </>
  )
}
