import { useState } from 'react'
import { Link } from 'react-router'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { CircleAlert, LockKeyhole, Mail } from 'lucide-react'
import { Button, LiveRegion, TextField } from '@/components/ui'
import { paths } from '@/routes/paths'
import { authService } from '@/services/auth'
import { apiErrorMessage, apiStatus } from '@/services/errors'

const schema = Yup.object({
  email: Yup.string().trim().required('Informe o e-mail.').email('Informe um e-mail válido.'),
  password: Yup.string().required('Informe a senha.').min(6, 'A senha tem pelo menos 6 caracteres.'),
})

// Figma: formulário do Login (1:7168). Mensagens do PRD 01: W01-2, W01-3, W01-9, W01-10.
export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null)

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={schema}
      onSubmit={async ({ email, password }) => {
        setError(null)
        try {
          await authService.login(email.trim(), password)
          onSuccess()
        } catch (e) {
          setError(apiStatus(e) === 401 ? 'E-mail ou senha incorretos.' : apiErrorMessage(e))
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-2 text-center">
            <h1 className="text-title-1 font-semibold text-ink">Entrar</h1>
            <p className="mt-1 text-note text-ink-muted">Painel administrativo do OncoMente</p>
          </div>

          <TextField
            label="E-mail"
            hideLabel
            name="email"
            type="email"
            autoComplete="username"
            placeholder="Email"
            icon={Mail}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : undefined}
            required
          />
          <TextField
            label="Senha"
            hideLabel
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            icon={LockKeyhole}
            revealable
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
            required
          />

          <Link
            to={paths.forgotPassword}
            className="inline-flex items-center gap-1 self-start text-note text-info underline-offset-2 hover:underline"
          >
            <CircleAlert size={14} aria-hidden />
            Esqueci minha senha
          </Link>

          <LiveRegion message={error} />

          <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
            Entrar
          </Button>

          <p className="text-center text-support text-ink">
            Não tem conta? <span className="text-primary">Peça acesso à equipe responsável pelo OncoMente.</span>
          </p>
        </form>
      )}
    </Formik>
  )
}
