import type { Pronoun, UserRole } from '@/types/user'

export const roleLabels: Record<UserRole, string> = {
  PATIENT: 'Paciente',
  CAREGIVER: 'Cuidador',
  ADMIN: 'Administrador',
}

export const roleOptions = (Object.keys(roleLabels) as UserRole[]).map((value) => ({
  value,
  label: roleLabels[value],
}))

export const pronounLabels: Record<Pronoun, string> = {
  SR: 'Sr.',
  SRA: 'Sra.',
  SRTA: 'Srta.',
  CUSTOM: 'Personalizado',
  NOT_INFORMED: 'Não informado',
}

export function pronounLabel(pronoun: Pronoun | null | undefined) {
  return pronoun ? pronounLabels[pronoun] : pronounLabels.NOT_INFORMED
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateFormat.format(date)
}
