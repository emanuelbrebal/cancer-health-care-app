import { Link } from 'react-router'
import { Panel } from '@/components/ui'
import { PageHeader } from '@/layouts/PageHeader'
import { paths } from '@/routes/paths'

export default function NotFoundPage() {
  return (
    <>
      <PageHeader title="Página não encontrada" />
      <Panel>
        <p className="text-body-sm text-ink">
          O endereço não existe no painel.{' '}
          <Link to={paths.home} className="text-primary underline">
            Voltar ao início
          </Link>
          .
        </p>
      </Panel>
    </>
  )
}
