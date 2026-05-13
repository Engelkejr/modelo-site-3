import { createClient } from '@/lib/supabase/server'
import FormConfiguracoes from '@/components/admin/FormConfiguracoes'

export default async function ConfiguracoesPage() {
  const supabase = await createClient()
  const { data: config } = await supabase
    .from('configuracoes')
    .select('*')
    .single()

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Configurações da Loja</h1>
        <p className="text-gray-500 text-sm mt-0.5">Altere o nome, WhatsApp e redes sociais</p>
      </div>
      <FormConfiguracoes config={config} />
    </div>
  )
}
