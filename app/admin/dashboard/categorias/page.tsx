import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import DeleteCategoriaButton from '@/components/admin/DeleteCategoriaButton'

export default async function CategoriasPage() {
  const supabase = await createClient()
  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .order('ordem')

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Categorias</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {categorias?.length ?? 0} categoria{(categorias?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/dashboard/categorias/nova"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Nova
        </Link>
      </div>

      {!categorias?.length ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400">Nenhuma categoria cadastrada.</p>
          <Link href="/admin/dashboard/categorias/nova" className="btn-primary inline-flex items-center gap-2 mt-4">
            <Plus size={16} /> Criar primeira categoria
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-gray-50">
          {categorias.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50">
              <div>
                <p className="font-semibold text-gray-900">{cat.nome}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  /{cat.slug}
                  {' · '}
                  <span className={cat.ativo ? 'text-green-600' : 'text-red-500'}>
                    {cat.ativo ? 'Ativa' : 'Inativa'}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/dashboard/categorias/${cat.id}`}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                  aria-label="Editar"
                >
                  <Pencil size={14} />
                </Link>
                <DeleteCategoriaButton id={cat.id} nome={cat.nome} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
