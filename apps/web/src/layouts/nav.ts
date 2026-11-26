import { LayoutDashboard } from 'lucide-react'
import { paths } from '@/routes/paths'
import type { NavItem } from './Sidebar'

// Itens do menu (D7: só telas que existem).
export const navItems: NavItem[] = [{ to: paths.home, label: 'Início', icon: LayoutDashboard, end: true }]
