'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Categoria, Produto, Configuracao } from '@/lib/types'
import CardProduto from './CardProduto'

interface CatalogoClienteProps {
  categorias: Categoria[]
  produtos: Produto[]
  config: Configuracao
}

export default function CatalogoCliente({
  categorias,
  produtos,
  config,
}: CatalogoClienteProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const matchCategoria =
        categoriaSelecionada === null || p.categoria_id === categoriaSelecionada
      const matchBusca =
        busca.trim() === '' ||
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.descricao?.toLowerCase().includes(busca.toLowerCase())
      return matchCategoria && matchBusca
    })
  }, [produtos, categoriaSelecionada, busca])

  const destaques = useMemo(
    () => produtos.filter((p) => p.destaque),
    [produtos]
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {config.descricao_loja && (
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
          <h1 className="font-display font-bold text-2xl">{config.nome_loja}</h1>
          <p className="text-brand-100 mt-1 text-sm">{config.descricao_loja}</p>
        </div>
      )}

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input pl-10"
        />
      </div>

      {categorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setCategoriaSelecionada(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              categoriaSelecionada === null
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-400'
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSelecionada(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                categoriaSelecionada === cat.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-400'
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      )}

      {!categoriaSelecionada && !busca && destaques.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-lg text-gray-900 mb-3">
            ⭐ Destaques
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {destaques.map((produto) => (
              <CardProduto key={produto.id} produto={produto} />
            ))}
          </div>
        </section>
      )}

      <section>
        {(categoriaSelecionada || busca) && (
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-gray-900">
              {busca
                ? `Resultados para "${busca}"`
                : categorias.find((c) => c.id === categoriaSelecionada)?.nome ?? 'Produtos'}
            </h2>
            <span className="text-sm text-gray-400">
              {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {(!categoriaSelecionada && !busca) && (
          <h2 className="font-display font-bold text-lg text-gray-900 mb-3">
            Todos os produtos
          </h2>
        )}

        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold">Nenhum produto encontrado</p>
            <p className="text-sm mt-1">Tente outro filtro ou busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {produtosFiltrados.map((produto) => (
              <CardProduto key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
