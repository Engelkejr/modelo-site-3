'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Store, Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('Email ou senha incorretos. Verifique e tente novamente.')
      setCarregando(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Store size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Área Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Acesse o painel da sua loja</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@exemplo.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="senha">Senha</label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {carregando ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 text-center">
            <a
              href="/loja"
              className="text-sm text-gray-400 hover:text-brand-600 transition-colors"
            >
              ← Ver catálogo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
