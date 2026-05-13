import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import FormProduto from '@/components/admin/FormProduto'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: produto }, { data: categorias }] = await Promise.all([
    supabase.from('produtos').select('*').eq('id', id).single(),
    supabase
      .from('categorias')
      .select('id, nome')
      .eq('ativo', true)
      .order('ordem'),
  ])

  if (!produto) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Editar Produto</h1>
        <p className="text-gray-500 text-sm mt-0.5 truncate">{produto.nome}</p>
      </div>
      <FormProduto produto={produto} categorias={categorias ?? []} />
    </div>
  )
}
