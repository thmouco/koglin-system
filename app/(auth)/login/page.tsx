"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plane, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-mail ou senha inválidos. Tente novamente.')
      setLoading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) { setError('Informe o e-mail cadastrado.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) { setError('Não foi possível enviar o e-mail. Verifique o endereço.'); return }
    setResetSent(true)
  }

  return (
    <div className="min-h-screen bg-[#00204a] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-[#00204a] px-8 py-8 flex flex-col items-center border-b-4 border-[#fcb900]">
          <div className="flex items-center gap-3 mb-2">
            <Plane className="h-8 w-8 text-[#fcb900]" />
            <div className="text-white">
              <div className="font-bold text-xl leading-tight">Koglin Viagens</div>
              <div className="text-xs text-white/60 leading-tight">Lufthansa City Center</div>
            </div>
          </div>
          <p className="text-white/70 text-sm mt-3">Sistema de Gerenciamento de Grupos</p>
        </div>

        <div className="px-8 py-8">
          {mode === 'login' ? (
            <>
              <h2 className="text-lg font-bold text-[#00204a] mb-6">Entrar no sistema</h2>

              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email" type="email" placeholder="seu@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Entrando...</> : 'Entrar'}
                </Button>
              </form>

              <button
                onClick={() => { setMode('reset'); setError('') }}
                className="mt-4 w-full text-sm text-[#00204a]/60 hover:text-[#00204a] transition-colors text-center"
              >
                Esqueci minha senha
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-[#00204a] mb-2">Recuperar senha</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Informe seu e-mail e enviaremos um link para criar uma nova senha.
              </p>

              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {resetSent ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                  <p className="text-sm text-center text-green-700 font-medium">
                    E-mail enviado! Verifique sua caixa de entrada e clique no link para redefinir a senha.
                  </p>
                  <button
                    onClick={() => { setMode('login'); setResetSent(false) }}
                    className="mt-2 text-sm text-[#00204a] underline"
                  >
                    Voltar ao login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="reset-email">E-mail cadastrado</Label>
                    <Input
                      id="reset-email" type="email" placeholder="seu@email.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      required autoComplete="email"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</> : 'Enviar link de recuperação'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError('') }}
                    className="w-full text-sm text-[#00204a]/60 hover:text-[#00204a] transition-colors text-center"
                  >
                    Voltar ao login
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-white/30 text-xs mt-8">
        © {new Date().getFullYear()} Koglin Viagens · Todos os direitos reservados
      </p>
    </div>
  )
}
