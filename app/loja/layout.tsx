import { createClient } from '@/lib/supabase/server'
import { Configuracao } from '@/lib/types'
import Navbar from '@/components/loja/Navbar'
import Footer from '@/components/loja/Footer'

export default async function LojaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('configuracoes')
    .select('*')
    .single()

  const config: Configuracao = data ?? {
    id: '',
    nome_loja: 'Minha Loja',
    whatsapp_contato: '5511999999999',
    link_instagram: '',
    link_facebook: '',
    descricao_loja: '',
    cor_primaria: '#16a34a',
    logo_url: '',
    created_at: '',
    updated_at: '',
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar nomeLoja={config.nome_loja} logoUrl={config.logo_url} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer config={config} />
    </div>
  )
}
