import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import FormCategoria from '@/components/admin/FormCategoria'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarCategoriaPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: categoria } = await supabase
    .from('categorias')
    .select('*')
    .eq('id', id)
    .single()

  if (!categoria) notFound()

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Editar Categoria</h1>
        <p className="text-gray-500 text-sm mt-0.5">{categoria.nome}</p>
      </div>
      <FormCategoria categoria={categoria} />
    </div>
  )
}
