import { CircleAlert } from 'lucide-react'

// Figma: "Informativos" de campo (icon-park-outline:error, 341:7843).
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="flex items-center gap-1 text-note text-danger">
      <CircleAlert size={16} aria-hidden />
      {message}
    </p>
  )
}
