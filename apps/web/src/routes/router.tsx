import { createBrowserRouter, Navigate } from 'react-router'
import { AdminLayout } from '@/layouts/AdminLayout'
import ChangePasswordPage from '@/pages/account/ChangePasswordPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import LoginPage from '@/pages/auth/LoginPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import HomePage from '@/pages/home/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import { paths } from './paths'
import { RequireAdmin } from './RequireAdmin'

export const router = createBrowserRouter([
  { path: paths.login, element: <LoginPage /> },
  { path: paths.forgotPassword, element: <ForgotPasswordPage /> },
  { path: paths.resetPassword, element: <ResetPasswordPage /> },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'conta', element: <ChangePasswordPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '*', element: <Navigate to={paths.login} replace /> },
])
