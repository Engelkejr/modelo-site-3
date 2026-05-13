import { createClient } from '@/lib/supabase/server'
import { Categoria, Produto, Configuracao } from '@/lib/types'
import CatalogoCliente from '@/components/loja/CatalogoCliente'

export const revalidate = 60

export default async function LojaPage() {
  const supabase = await createClient()

  const [{ data: categoriasData }, { data: produtosData }, { data: configData }] =
    await Promise.all([
      supabase
        .from('categorias')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true }),
      supabase
        .from('produtos_com_categoria')
        .select('*')
        .eq('disponivel', true)
        .order('created_at', { ascending: false }),
      supabase.from('configuracoes').select('*').single(),
    ])

  const categorias: Categoria[] = categoriasData ?? []
  const produtos: Produto[] = produtosData ?? []
  const config: Configuracao = configData ?? {
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
    <CatalogoCliente
      categorias={categorias}
      produtos={produtos}
      config={config}
    />
  )
}
