import FormCategoria from '@/components/admin/FormCategoria'

export default function NovaCategoriaPage() {
  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Nova Categoria</h1>
        <p className="text-gray-500 text-sm mt-0.5">Crie uma nova categoria de produtos</p>
      </div>
      <FormCategoria />
    </div>
  )
}
