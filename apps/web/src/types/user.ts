export type UserRole = 'PATIENT' | 'CAREGIVER' | 'ADMIN'

// Mesmo enum de packages/shared/types/user.ts (PronounEnum).
export type Pronoun = 'SR' | 'SRA' | 'SRTA' | 'CUSTOM' | 'NOT_INFORMED'

// Formato devolvido por UserMapper.toDto no backend.
export interface ApiUser {
  id: string
  name: string | null
  email: string
  role: UserRole
  pronoun: Pronoun | null
  phone_number?: string | null
  birthday?: string | null
  profile_picture?: string | null
  createdAt: string
}

export type AdminUser = ApiUser
