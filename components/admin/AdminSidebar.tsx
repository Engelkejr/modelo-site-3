'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, Tag, Settings,
  LogOut, Store, Menu, X, ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AdminSidebarProps {
  nomeLoja: string
  userEmail: string
}

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/dashboard/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/dashboard/categorias', label: 'Categorias', icon: Tag },
  { href: '/admin/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

export default function AdminSidebar({ nomeLoja, userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Store size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-gray-900 truncate text-sm">
              {nomeLoja}
            </p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive(link.href, link.exact)
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <link.icon size={18} />
            {link.label}
          </Link>
        ))}

        <a
          href="/loja"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <ExternalLink size={18} />
          Ver Loja
        </a>
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all w-full"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex-col z-30">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 h-16 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <Store size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-sm">{nomeLoja}</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed top-16 left-0 bottom-0 w-64 bg-white z-40 border-r border-gray-100">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
