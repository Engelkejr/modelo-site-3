'use client'

import { useState } from 'react'
import { Trash2, X, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface DeleteCategoriaButtonProps {
  id: string
  nome: string
}

export default function DeleteCategoriaButton({ id, nome }: DeleteCategoriaButtonProps) {
  const [confirmando, setConfirmando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setExcluindo(true)
    const supabase = createClient()
    const { error } = await supabase.from('categorias').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao excluir categoria')
      setExcluindo(false)
      setConfirmando(false)
      return
    }

    toast.success('Categoria excluída!')
    router.refresh()
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-xl px-2 py-1.5 animate-fade-in">
        <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
        <span className="text-xs text-red-600 font-semibold hidden sm:inline">Confirmar?</span>
        <button
          onClick={handleDelete}
          disabled={excluindo}
          className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded-lg transition-colors"
        >
          {excluindo ? '...' : 'Sim'}
        </button>
        <button
          onClick={() => setConfirmando(false)}
          className="text-gray-400 hover:text-gray-600 p-0.5"
        >
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400"
      aria-label={`Excluir ${nome}`}
    >
      <Trash2 size={14} />
    </button>
  )
}
