import { useEffect, useRef } from 'react'
import { useFormikContext } from 'formik'

// WCAG 3.3.1: envio inválido leva o foco ao primeiro campo com erro; o leitor de tela lê o rótulo
// e a mensagem (aria-describedby). Roda uma vez por envio, para não roubar o foco durante a digitação.
export function FocusFirstError() {
  const { submitCount, isSubmitting, isValid } = useFormikContext()
  const anchor = useRef<HTMLSpanElement>(null)
  const handled = useRef(0)

  useEffect(() => {
    if (isSubmitting || submitCount === handled.current) return
    handled.current = submitCount
    if (isValid) return
    anchor.current?.closest('form')?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [submitCount, isSubmitting, isValid])

  return <span ref={anchor} hidden />
}
