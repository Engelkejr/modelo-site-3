'use client'

import { useEffect, useState } from 'react'
import { X, Trash2, ShoppingBag, Plus, Minus, MessageCircle } from 'lucide-react'
import { useCarrinho } from '@/context/CarrinhoContext'
import { formatarPreco, gerarMensagemWhatsApp } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface CarrinhoDrawerProps {
  aberto: boolean
  onFechar: () => void
}

export default function CarrinhoDrawer({ aberto, onFechar }: CarrinhoDrawerProps) {
  const { itens, total, alterarQuantidade, removerItem, limparCarrinho } = useCarrinho()
  const [whatsapp, setWhatsapp] = useState('')
  const [nomeLoja, setNomeLoja] = useState('Minha Loja')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('configuracoes')
      .select('whatsapp_contato, nome_loja')
      .single()
      .then(({ data }) => {
        if (data) {
          setWhatsapp(data.whatsapp_contato)
          setNomeLoja(data.nome_loja)
        }
      })
  }, [])

  const finalizarPedido = () => {
    if (itens.length === 0) return
    const msg = gerarMensagemWhatsApp(itens, nomeLoja)
    const numero = whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/${numero}?text=${msg}`, '_blank')
  }

  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [aberto])

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          aberto ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onFechar}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          aberto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-600" />
            <h2 className="font-display font-bold text-lg">Meu Carrinho</h2>
          </div>
          <button
            onClick={onFechar}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Fechar carrinho"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag size={48} className="text-gray-200 mb-4" />
              <p className="font-semibold text-gray-500">Carrinho vazio</p>
              <p className="text-sm text-gray-400 mt-1">Adicione produtos para continuar</p>
              <button
                onClick={onFechar}
                className="mt-4 btn-primary text-sm"
              >
                Ver produtos
              </button>
            </div>
          ) : (
            <ul className="space-y-3 py-2">
              {itens.map((item) => (
                <li key={item.produto.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  {item.produto.imagem_url && (
                    <img
                      src={item.produto.imagem_url}
                      alt={item.produto.nome}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {item.produto.nome}
                    </p>
                    <p className="text-brand-600 font-bold text-sm mt-0.5">
                      {formatarPreco(item.produto.preco)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Diminuir"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                        className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors"
                        aria-label="Aumentar"
                      >
                        <Plus size={12} />
                      </button>

                      <button
                        onClick={() => removerItem(item.produto.id)}
                        className="ml-auto p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remover"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {itens.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-2xl font-display font-bold text-gray-900">
                {formatarPreco(total)}
              </span>
            </div>

            <button
              onClick={finalizarPedido}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] text-base"
            >
              <MessageCircle size={20} />
              Finalizar pelo WhatsApp
            </button>

            <button
              onClick={limparCarrinho}
              className="w-full text-sm text-gray-400 hover:text-red-500 transition-colors py-1"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  )
}
