import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, Tag, Settings, ExternalLink } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ count: totalProdutos }, { count: totalCategorias }, { data: config }] =
    await Promise.all([
      supabase.from('produtos').select('*', { count: 'exact', head: true }),
      supabase.from('categorias').select('*', { count: 'exact', head: true }),
      supabase.from('configuracoes').select('nome_loja, whatsapp_contato').single(),
    ])

  const cards = [
    {
      titulo: 'Produtos',
      valor: totalProdutos ?? 0,
      icon: Package,
      cor: 'bg-blue-50 text-blue-600',
      href: '/admin/dashboard/produtos',
    },
    {
      titulo: 'Categorias',
      valor: totalCategorias ?? 0,
      icon: Tag,
      cor: 'bg-purple-50 text-purple-600',
      href: '/admin/dashboard/categorias',
    },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">
          Olá! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Bem-vindo ao painel da <strong>{config?.nome_loja}</strong>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.titulo}
            href={card.href}
            className="card p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.cor} mb-3`}>
              <card.icon size={20} />
            </div>
            <p className="font-display font-bold text-3xl text-gray-900">
              {card.valor}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{card.titulo}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-3">
        <Link
          href="/admin/dashboard/produtos/novo"
          className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center">
            <Package size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Adicionar Produto</p>
            <p className="text-sm text-gray-400">Cadastrar novo produto no catálogo</p>
          </div>
        </Link>

        <Link
          href="/admin/dashboard/configuracoes"
          className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Configurações da Loja</p>
            <p className="text-sm text-gray-400">
              WhatsApp: {config?.whatsapp_contato ?? '—'}
            </p>
          </div>
        </Link>

        <a
          href="/loja"
          target="_blank"
          rel="noopener noreferrer"
          className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <ExternalLink size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Ver Catálogo</p>
            <p className="text-sm text-gray-400">Abrir a loja como cliente</p>
          </div>
        </a>
      </div>
    </div>
  )
}
