import { createClient } from '@/lib/supabase/server'
import FormProduto from '@/components/admin/FormProduto'

export default async function NovoProdutoPage() {
  const supabase = await createClient()
  const { data: categorias } = await supabase
    .from('categorias')
    .select('id, nome')
    .eq('ativo', true)
    .order('ordem')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Novo Produto</h1>
        <p className="text-gray-500 text-sm mt-0.5">Preencha os dados do produto</p>
      </div>
      <FormProduto categorias={categorias ?? []} />
    </div>
  )
}
