'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Store, Menu, X } from 'lucide-react'
import { useCarrinho } from '@/context/CarrinhoContext'
import CarrinhoDrawer from './CarrinhoDrawer'

interface NavbarProps {
  nomeLoja: string
  logoUrl?: string
}

export default function Navbar({ nomeLoja, logoUrl }: NavbarProps) {
  const { quantidadeTotal } = useCarrinho()
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/loja" className="flex items-center gap-2 font-display font-bold text-xl text-gray-900">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={nomeLoja}
                width={32}
                height={32}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
            )}
            <span className="truncate max-w-[160px]">{nomeLoja}</span>
          </Link>

          <button
            onClick={() => setCarrinhoAberto(true)}
            className="relative flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Carrinho</span>
            {quantidadeTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
                {quantidadeTotal > 99 ? '99+' : quantidadeTotal}
              </span>
            )}
          </button>
        </div>
      </header>

      <CarrinhoDrawer
        aberto={carrinhoAberto}
        onFechar={() => setCarrinhoAberto(false)}
      />
    </>
  )
}
