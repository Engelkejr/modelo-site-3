import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: config } = await supabase
    .from('configuracoes')
    .select('nome_loja')
    .single()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        nomeLoja={config?.nome_loja ?? 'Minha Loja'}
        userEmail={user.email ?? ''}
      />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  )
}
