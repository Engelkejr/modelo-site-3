'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Produto } from '@/lib/types'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface FormProdutoProps {
  produto?: Produto
  categorias: { id: string; nome: string }[]
}

export default function FormProduto({ produto, categorias }: FormProdutoProps) {
  const router = useRouter()
  const isEdicao = !!produto

  const [form, setForm] = useState({
    nome: produto?.nome ?? '',
    descricao: produto?.descricao ?? '',
    preco: produto?.preco?.toString() ?? '',
    preco_antigo: produto?.preco_antigo?.toString() ?? '',
    imagem_url: produto?.imagem_url ?? '',
    categoria_id: produto?.categoria_id ?? '',
    disponivel: produto?.disponivel ?? true,
    destaque: produto?.destaque ?? false,
  })

  const [uploading, setUploading] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from('produtos')
      .upload(fileName, file, { upsert: true })

    if (error) {
      toast.error('Erro ao fazer upload da imagem')
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('produtos')
      .getPublicUrl(data.path)

    setForm((prev) => ({ ...prev, imagem_url: urlData.publicUrl }))
    toast.success('Imagem enviada!')
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)

    const supabase = createClient()
    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      preco: parseFloat(form.preco),
      preco_antigo: form.preco_antigo ? parseFloat(form.preco_antigo) : null,
      imagem_url: form.imagem_url,
      categoria_id: form.categoria_id || null,
      disponivel: form.disponivel,
      destaque: form.destaque,
    }

    const { error } = isEdicao
      ? await supabase.from('produtos').update(payload).eq('id', produto!.id)
      : await supabase.from('produtos').insert(payload)

    if (error) {
      toast.error('Erro ao salvar produto: ' + error.message)
      setSalvando(false)
      return
    }

    toast.success(isEdicao ? 'Produto atualizado!' : 'Produto criado!')
    router.push('/admin/dashboard/produtos')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Link
        href="/admin/dashboard/produtos"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar aos produtos
      </Link>

      <div className="card p-5 space-y-4">
        <div>
          <label className="label" htmlFor="nome">Nome do Produto *</label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
            className="input"
            required
            placeholder="Ex: Camiseta Básica Branca"
          />
        </div>

        <div>
          <label className="label" htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            className="input resize-none"
            rows={3}
            placeholder="Descreva o produto..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="preco">Preço (R$) *</label>
            <input
              id="preco"
              name="preco"
              type="number"
              step="0.01"
              min="0"
              value={form.preco}
              onChange={handleChange}
              className="input"
              required
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="label" htmlFor="preco_antigo">
              Preço Antigo (R$)
              <span className="font-normal text-gray-400 ml-1">(opcional)</span>
            </label>
            <input
              id="preco_antigo"
              name="preco_antigo"
              type="number"
              step="0.01"
              min="0"
              value={form.preco_antigo}
              onChange={handleChange}
              className="input"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="categoria_id">Categoria</label>
          <select
            id="categoria_id"
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            className="input"
          >
            <option value="">Sem categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

  
        <div>
          <label className="label">Imagem do Produto</label>
          <div className="space-y-2">
            <input
              name="imagem_url"
              type="url"
              value={form.imagem_url}
              onChange={handleChange}
              className="input"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">ou</span>
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
                <Upload size={14} />
                {uploading ? 'Enviando...' : 'Upload do computador'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            {form.imagem_url && (
              <img
                src={form.imagem_url}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-xl border border-gray-200"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                name="disponivel"
                checked={form.disponivel}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  form.disponivel ? 'bg-brand-600' : 'bg-gray-200'
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.disponivel ? 'translate-x-4' : ''
                }`}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Produto disponível
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                name="destaque"
                checked={form.destaque}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  form.destaque ? 'bg-amber-500' : 'bg-gray-200'
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.destaque ? 'translate-x-4' : ''
                }`}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              ⭐ Produto em destaque
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={salvando || uploading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {salvando ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save size={16} />
        )}
        {salvando ? 'Salvando...' : isEdicao ? 'Salvar Alterações' : 'Criar Produto'}
      </button>
    </form>
  )
}
