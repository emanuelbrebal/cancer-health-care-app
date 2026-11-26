import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { KeyRound, LockKeyhole } from 'lucide-react'
import { Button, FocusFirstError, LiveRegion, TextField } from '@/components/ui'
import { AuthLayout } from '@/layouts/AuthLayout'
import { paths } from '@/routes/paths'
import { authService } from '@/services/auth'
import { apiErrorMessage } from '@/services/errors'

// Sem frame no Figma (D3): reusa o layout do login. O e-mail do backend traz o código em
// texto; se vier `?token=`, o campo já vem preenchido.
export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <AuthLayout>
      <h1 className="mb-6 text-center text-title-1 font-semibold text-ink">Redefinir senha</h1>
      {done ? (
        <div className="flex flex-col gap-6">
          <LiveRegion tone="success" message={done} />
          <Link
            to={paths.login}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 font-semibold text-ink-inverse"
          >
            Ir para o login
          </Link>
        </div>
      ) : (
        <Formik
          initialValues={{ token: params.get('token') ?? '', newPassword: '', confirm: '' }}
          validationSchema={Yup.object({
            token: Yup.string().trim().required('Cole o código recebido por e-mail.'),
            newPassword: Yup.string().required('Informe a nova senha.').min(6, 'Use pelo menos 6 caracteres.'),
            confirm: Yup.string()
              .required('Repita a nova senha.')
              .oneOf([Yup.ref('newPassword')], 'As senhas não conferem.'),
          })}
          onSubmit={async ({ token, newPassword }) => {
            setError(null)
            try {
              setDone(await authService.resetPassword(token.trim(), newPassword))
            } catch (e) {
              setError(apiErrorMessage(e, 'Código inválido ou expirado.'))
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FocusFirstError />
              <TextField
                label="Código recebido por e-mail"
                name="token"
                icon={KeyRound}
                autoComplete="one-time-code"
                value={values.token}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.token ? errors.token : undefined}
                required
              />
              <TextField
                label="Nova senha"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                icon={LockKeyhole}
                revealable
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
                icon={LockKeyhole}
                revealable
                value={values.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirm ? errors.confirm : undefined}
                required
              />
              <LiveRegion message={error} />
              <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
                Redefinir senha
              </Button>
              <Link to={paths.login} className="text-center text-support text-primary underline">
                Voltar para o login
              </Link>
            </form>
          )}
        </Formik>
      )}
    </AuthLayout>
  )
}
