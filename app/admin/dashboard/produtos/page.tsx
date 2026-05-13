import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { formatarPreco } from '@/lib/utils'
import DeleteProdutoButton from '@/components/admin/DeleteProdutoButton'

export default async function ProdutosPage() {
  const supabase = await createClient()

  const { data: produtos } = await supabase
    .from('produtos_com_categoria')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Produtos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {produtos?.length ?? 0} produto{(produtos?.length ?? 0) !== 1 ? 's' : ''} cadastrado{(produtos?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/dashboard/produtos/novo"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Novo
        </Link>
      </div>

      {!produtos?.length ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400">Nenhum produto cadastrado ainda.</p>
          <Link href="/admin/dashboard/produtos/novo" className="btn-primary inline-flex items-center gap-2 mt-4">
            <Plus size={16} /> Cadastrar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Produto</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Preço</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {produto.imagem_url && (
                          <img
                            src={produto.imagem_url}
                            alt={produto.nome}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{produto.nome}</p>
                          {produto.destaque && (
                            <span className="text-xs text-amber-600 font-medium">⭐ Destaque</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {produto.categoria_nome ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-600">
                      {formatarPreco(produto.preco)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          produto.disponivel
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {produto.disponivel ? 'Disponível' : 'Indisponível'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/dashboard/produtos/${produto.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                          aria-label="Editar"
                        >
                          <Pencil size={14} />
                        </Link>
                        <DeleteProdutoButton id={produto.id} nome={produto.nome} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
