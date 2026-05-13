'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Configuracao } from '@/lib/types'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface FormConfiguracoesProps {
  config: Configuracao | null
}

export default function FormConfiguracoes({ config }: FormConfiguracoesProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    nome_loja: config?.nome_loja ?? '',
    whatsapp_contato: config?.whatsapp_contato ?? '',
    link_instagram: config?.link_instagram ?? '',
    link_facebook: config?.link_facebook ?? '',
    descricao_loja: config?.descricao_loja ?? '',
    logo_url: config?.logo_url ?? '',
  })
  const [salvando, setSalvando] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)

    const supabase = createClient()

    const { error } = config?.id
      ? await supabase.from('configuracoes').update(form).eq('id', config.id)
      : await supabase.from('configuracoes').insert(form)

    if (error) {
      toast.error('Erro ao salvar: ' + error.message)
      setSalvando(false)
      return
    }

    toast.success('Configurações salvas!')
    router.refresh()
    setSalvando(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">Informações Básicas</h2>

        <div>
          <label className="label" htmlFor="nome_loja">Nome da Loja *</label>
          <input
            id="nome_loja"
            name="nome_loja"
            type="text"
            value={form.nome_loja}
            onChange={handleChange}
            className="input"
            required
            placeholder="Minha Loja"
          />
        </div>

        <div>
          <label className="label" htmlFor="descricao_loja">Descrição / Slogan</label>
          <textarea
            id="descricao_loja"
            name="descricao_loja"
            value={form.descricao_loja}
            onChange={handleChange}
            className="input resize-none"
            rows={2}
            placeholder="Os melhores produtos da cidade!"
          />
        </div>

        <div>
          <label className="label" htmlFor="logo_url">URL do Logo</label>
          <input
            id="logo_url"
            name="logo_url"
            type="url"
            value={form.logo_url}
            onChange={handleChange}
            className="input"
            placeholder="https://exemplo.com/logo.png"
          />
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-gray-900">Contato e Redes Sociais</h2>

        <div>
          <label className="label" htmlFor="whatsapp_contato">
            WhatsApp *
            <span className="font-normal text-gray-400 ml-1">somente números com DDI+DDD</span>
          </label>
          <input
            id="whatsapp_contato"
            name="whatsapp_contato"
            type="text"
            value={form.whatsapp_contato}
            onChange={handleChange}
            className="input font-mono"
            required
            placeholder="5511999999999"
          />
          <p className="text-xs text-gray-400 mt-1">
            Exemplo: 5511999999999 (55 = Brasil, 11 = DDD, + número)
          </p>
        </div>

        <div>
          <label className="label" htmlFor="link_instagram">Instagram</label>
          <input
            id="link_instagram"
            name="link_instagram"
            type="url"
            value={form.link_instagram}
            onChange={handleChange}
            className="input"
            placeholder="https://instagram.com/sualoja"
          />
        </div>

        <div>
          <label className="label" htmlFor="link_facebook">Facebook</label>
          <input
            id="link_facebook"
            name="link_facebook"
            type="url"
            value={form.link_facebook}
            onChange={handleChange}
            className="input"
            placeholder="https://facebook.com/sualoja"
          />
        </div>
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
        {salvando ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </form>
  )
}
