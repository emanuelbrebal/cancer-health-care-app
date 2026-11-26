import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Button, LiveRegion, Panel, TextField } from '@/components/ui'
import { PageHeader } from '@/layouts/PageHeader'
import { paths } from '@/routes/paths'
import { authService } from '@/services/auth'
import { apiErrorMessage, apiStatus } from '@/services/errors'
import { useSession } from '@/store/session'

// Figma: Minha Conta (45:1657), frame vazio: conteúdo segue o padrão do formulário (40:1063).
// PRD 01 W01-8: depois de trocar, o backend encerra todas as sessões; voltamos ao login.
export default function ChangePasswordPage() {
  const user = useSession((s) => s.user)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <PageHeader title="Minha conta" description={user?.email} />
      <Panel title="Trocar senha">
        <Formik
          initialValues={{ currentPassword: '', newPassword: '', confirm: '' }}
          validationSchema={Yup.object({
            currentPassword: Yup.string().required('Informe a senha atual.'),
            newPassword: Yup.string()
              .required('Informe a nova senha.')
              .min(6, 'Use pelo menos 6 caracteres.')
              .notOneOf([Yup.ref('currentPassword')], 'A nova senha precisa ser diferente da atual.'),
            confirm: Yup.string()
              .required('Repita a nova senha.')
              .oneOf([Yup.ref('newPassword')], 'As senhas não conferem.'),
          })}
          onSubmit={async ({ currentPassword, newPassword }) => {
            setError(null)
            try {
              await authService.changePassword(currentPassword, newPassword)
              navigate(paths.login, { replace: true })
            } catch (e) {
              setError(apiStatus(e) === 401 ? 'Senha atual incorreta.' : apiErrorMessage(e))
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form noValidate onSubmit={handleSubmit} className="flex max-w-[520px] flex-col gap-4">
              <TextField
                label="Senha atual"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                revealable
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.currentPassword ? errors.currentPassword : undefined}
                required
              />
              <TextField
                label="Nova senha"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                revealable
                hint="Mínimo de 6 caracteres. Você será desconectado de todos os dispositivos."
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword ? errors.newPassword : undefined}
                required
              />
              <TextField
                label="Repita a nova senha"
                name="confirm"
                type="password"
                autoComplete="new-password"
                revealable
                value={values.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirm ? errors.confirm : undefined}
                required
              />
              <LiveRegion message={error} />
              <Button type="submit" loading={isSubmitting} className="self-end min-w-[160px]">
                Salvar
              </Button>
            </form>
          )}
        </Formik>
      </Panel>
    </>
  )
}
