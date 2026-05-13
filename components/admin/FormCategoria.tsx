'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Categoria } from '@/lib/types'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { slugify } from '@/lib/utils'

interface FormCategoriaProps {
  categoria?: Categoria
}

export default function FormCategoria({ categoria }: FormCategoriaProps) {
  const router = useRouter()
  const isEdicao = !!categoria

  const [form, setForm] = useState({
    nome: categoria?.nome ?? '',
    slug: categoria?.slug ?? '',
    ordem: categoria?.ordem?.toString() ?? '0',
    ativo: categoria?.ativo ?? true,
  })

  const [salvando, setSalvando] = useState(false)

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value
    setForm((prev) => ({
      ...prev,
      nome,
      slug: isEdicao ? prev.slug : slugify(nome),
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)

    const supabase = createClient()
    const payload = {
      nome: form.nome,
      slug: form.slug || slugify(form.nome),
      ordem: parseInt(form.ordem) || 0,
      ativo: form.ativo,
    }

    const { error } = isEdicao
      ? await supabase.from('categorias').update(payload).eq('id', categoria!.id)
      : await supabase.from('categorias').insert(payload)

    if (error) {
      toast.error(
        error.message.includes('unique')
          ? 'Já existe uma categoria com este slug.'
          : 'Erro ao salvar: ' + error.message
      )
      setSalvando(false)
      return
    }

    toast.success(isEdicao ? 'Categoria atualizada!' : 'Categoria criada!')
    router.push('/admin/dashboard/categorias')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Link
        href="/admin/dashboard/categorias"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar às categorias
      </Link>

      <div className="card p-5 space-y-4">
        <div>
          <label className="label" htmlFor="nome">Nome da Categoria *</label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleNomeChange}
            className="input"
            required
            placeholder="Ex: Camisetas"
          />
        </div>

        <div>
          <label className="label" htmlFor="slug">
            Slug (URL)
            <span className="font-normal text-gray-400 ml-1">gerado automaticamente</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={form.slug}
            onChange={handleChange}
            className="input font-mono text-sm"
            placeholder="ex-camisetas"
          />
          <p className="text-xs text-gray-400 mt-1">
            Use apenas letras minúsculas, números e hífens
          </p>
        </div>

        <div>
          <label className="label" htmlFor="ordem">Ordem de exibição</label>
          <input
            id="ordem"
            name="ordem"
            type="number"
            min="0"
            value={form.ordem}
            onChange={handleChange}
            className="input"
          />
          <p className="text-xs text-gray-400 mt-1">Menor número = aparece primeiro</p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              name="ativo"
              checked={form.ativo}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                form.ativo ? 'bg-brand-600' : 'bg-gray-200'
              }`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.ativo ? 'translate-x-4' : ''
              }`}
            />
          </div>
          <span className="text-sm font-semibold text-gray-700">Categoria ativa</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={salvando}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {salvando ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save size={16} />
        )}
        {salvando ? 'Salvando...' : isEdicao ? 'Salvar Alterações' : 'Criar Categoria'}
      </button>
    </form>
  )
}
