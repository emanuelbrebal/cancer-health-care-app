import { useEffect } from 'react'
import { RouterProvider } from 'react-router/dom'
import { router } from '@/routes/router'
import { authService } from '@/services/auth'

// Boot: tenta restaurar a sessão pelo cookie HttpOnly antes de decidir login × painel.
export default function App() {
  useEffect(() => {
    void authService.restore()
  }, [])

  return <RouterProvider router={router} />
}
