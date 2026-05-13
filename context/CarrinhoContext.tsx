'use client'

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { ItemCarrinho, Produto } from '@/lib/types'
import toast from 'react-hot-toast'

interface CarrinhoContextType {
  itens: ItemCarrinho[]
  total: number
  quantidadeTotal: number
  adicionarItem: (produto: Produto) => void
  removerItem: (produtoId: string) => void
  alterarQuantidade: (produtoId: string, quantidade: number) => void
  limparCarrinho: () => void
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined)

type Action =
  | { type: 'ADICIONAR'; produto: Produto }
  | { type: 'REMOVER'; produtoId: string }
  | { type: 'ALTERAR_QTD'; produtoId: string; quantidade: number }
  | { type: 'LIMPAR' }
  | { type: 'CARREGAR'; itens: ItemCarrinho[] }

function carrinhoReducer(state: ItemCarrinho[], action: Action): ItemCarrinho[] {
  switch (action.type) {
    case 'CARREGAR':
      return action.itens

    case 'ADICIONAR': {
      const existente = state.find((i) => i.produto.id === action.produto.id)
      if (existente) {
        return state.map((i) =>
          i.produto.id === action.produto.id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        )
      }
      return [...state, { produto: action.produto, quantidade: 1 }]
    }

    case 'REMOVER':
      return state.filter((i) => i.produto.id !== action.produtoId)

    case 'ALTERAR_QTD':
      if (action.quantidade <= 0) {
        return state.filter((i) => i.produto.id !== action.produtoId)
      }
      return state.map((i) =>
        i.produto.id === action.produtoId
          ? { ...i, quantidade: action.quantidade }
          : i
      )

    case 'LIMPAR':
      return []

    default:
      return state
  }
}

const STORAGE_KEY = 'catalogo_carrinho'

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, dispatch] = useReducer(carrinhoReducer, [])

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY)
      if (salvo) {
        const parsed = JSON.parse(salvo)
        if (Array.isArray(parsed)) {
          dispatch({ type: 'CARREGAR', itens: parsed })
        }
      }
    } catch {
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itens))
    } catch {
    }
  }, [itens])

  const total = itens.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0
  )

  const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantidade, 0)

  const adicionarItem = useCallback((produto: Produto) => {
    dispatch({ type: 'ADICIONAR', produto })
    toast.success(`${produto.nome} adicionado!`, {
      duration: 1800,
      position: 'bottom-center',
      style: {
        background: '#166534',
        color: '#fff',
        borderRadius: '999px',
        padding: '8px 16px',
        fontSize: '14px',
      },
      icon: '🛒',
    })
  }, [])

  const removerItem = useCallback((produtoId: string) => {
    dispatch({ type: 'REMOVER', produtoId })
  }, [])

  const alterarQuantidade = useCallback((produtoId: string, quantidade: number) => {
    dispatch({ type: 'ALTERAR_QTD', produtoId, quantidade })
  }, [])

  const limparCarrinho = useCallback(() => {
    dispatch({ type: 'LIMPAR' })
  }, [])

  return (
    <CarrinhoContext.Provider
      value={{ itens, total, quantidadeTotal, adicionarItem, removerItem, alterarQuantidade, limparCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext)
  if (!ctx) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider')
  return ctx
}
