'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error('Nao foi possivel entrar agora. Se continuar, confira a configuracao do servidor.')
      return
    }

    toast.success('Bem-vinda de volta!')
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[var(--color-soft-white-dim)] text-sm">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          className="bg-[rgba(255,255,255,0.04)] border-[rgba(201,168,76,0.2)] text-[var(--color-soft-white)] placeholder:text-[var(--color-soft-white-dim)]/40 focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-[var(--color-soft-white-dim)] text-sm">
            Senha
          </Label>
          <Link
            href="/recuperar-senha"
            className="text-xs text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
          >
            Esqueci minha senha
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            autoComplete="current-password"
            className="bg-[rgba(255,255,255,0.04)] border-[rgba(201,168,76,0.2)] text-[var(--color-soft-white)] placeholder:text-[var(--color-soft-white-dim)]/40 focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20 pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-soft-white-dim)]/50 hover:text-[var(--color-soft-white-dim)] transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-5 font-semibold bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] disabled:opacity-60 shadow-md shadow-[rgba(201,168,76,0.2)]"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando...</>
        ) : (
          'Entrar'
        )}
      </Button>

      <p className="text-center text-sm text-[var(--color-soft-white-dim)]/60">
        Nao tem uma conta?{' '}
        <Link href="/cadastro" className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
