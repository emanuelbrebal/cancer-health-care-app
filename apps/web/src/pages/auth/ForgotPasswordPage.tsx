import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Mail, ShieldQuestion } from 'lucide-react'
import { Button, LiveRegion, Modal, TextField } from '@/components/ui'
import { AuthLayout } from '@/layouts/AuthLayout'
import { paths } from '@/routes/paths'
import { authService } from '@/services/auth'
import { apiErrorMessage } from '@/services/errors'

// Figma: "esqueci minha senha" (23:70, modal 23:259) sobre o login. PRD 01 W01-7: a resposta
// é sempre a mesma, exista ou não o e-mail.
export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [sent, setSent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const close = () => navigate(paths.login)

  return (
    <AuthLayout>
      <p className="text-center text-support text-ink-muted">
        <Link to={paths.login} className="text-primary underline">
          Voltar para o login
        </Link>
      </p>

      <Modal open title="Esqueci a senha" icon={ShieldQuestion} onClose={close}>
        {sent ? (
          <div className="flex flex-col gap-6">
            <LiveRegion tone="success" message={sent} />
            <p className="text-support text-ink">
              O e-mail traz um código. Use-o em{' '}
              <Link to={paths.resetPassword} className="text-primary underline">
                Redefinir senha
              </Link>
              . O código vale 15 minutos.
            </p>
            <Button onClick={close} className="self-end">
              Voltar ao login
            </Button>
          </div>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={Yup.object({
              email: Yup.string().trim().required('Informe o e-mail.').email('Informe um e-mail válido.'),
            })}
            onSubmit={async ({ email }) => {
              setError(null)
              try {
                setSent(await authService.forgotPassword(email.trim()))
              } catch (e) {
                setError(apiErrorMessage(e))
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
                <p className="text-support text-ink">
                  Digite seu e-mail e clique em “Enviar” para receber as instruções para redefinir sua senha.
                </p>
                <TextField
                  label="E-mail"
                  hideLabel
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Digite seu email"
                  icon={Mail}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : undefined}
                  required
                />
                <LiveRegion message={error} />
                <div className="flex flex-wrap justify-between gap-4">
                  <Button variant="danger-outline" onClick={close} className="min-w-[160px]">
                    Cancelar
                  </Button>
                  <Button type="submit" loading={isSubmitting} className="min-w-[160px]">
                    Enviar
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </Modal>
    </AuthLayout>
  )
}
