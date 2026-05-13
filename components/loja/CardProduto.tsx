'use client'

import { useState } from 'react'
import { ShoppingCart, Plus } from 'lucide-react'
import { Produto } from '@/lib/types'
import { formatarPreco } from '@/lib/utils'
import { useCarrinho } from '@/context/CarrinhoContext'

interface CardProdutoProps {
  produto: Produto
}

export default function CardProduto({ produto }: CardProdutoProps) {
  const { adicionarItem } = useCarrinho()
  const [imgError, setImgError] = useState(false)

  const temDesconto = produto.preco_antigo && produto.preco_antigo > produto.preco
  const percentualDesconto = temDesconto
    ? Math.round((1 - produto.preco / produto.preco_antigo!) * 100)
    : 0

  return (
    <div className="card group flex flex-col animate-fade-in">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {produto.imagem_url && !imgError ? (
          <img
            src={produto.imagem_url}
            alt={produto.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
            <ShoppingCart size={32} />
          </div>
        )}

        {temDesconto && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{percentualDesconto}%
          </span>
        )}

        {produto.destaque && !temDesconto && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ⭐
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="font-semibold text-sm text-gray-900 line-clamp-2 flex-1">
          {produto.nome}
        </p>

        {produto.descricao && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
            {produto.descricao}
          </p>
        )}

        <div className="mt-2 space-y-2">
          <div>
            {temDesconto && (
              <p className="text-xs text-gray-400 line-through">
                {formatarPreco(produto.preco_antigo!)}
              </p>
            )}
            <p className="font-display font-bold text-brand-600 text-base">
              {formatarPreco(produto.preco)}
            </p>
          </div>

          <button
            onClick={() => adicionarItem(produto)}
            className="w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-[0.97]"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
