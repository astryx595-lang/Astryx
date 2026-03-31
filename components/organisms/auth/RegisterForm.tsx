'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'

const inputClass =
  'bg-[rgba(255,255,255,0.04)] border-[rgba(201,168,76,0.2)] text-[var(--color-soft-white)] placeholder:text-[var(--color-soft-white-dim)]/40 focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20'

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-emerald-400' : 'text-[var(--color-soft-white-dim)]/50'}`}>
      {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {label}
    </span>
  )
}

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const password = watch('password', '')

  const onSubmit = async (data: RegisterInput) => {
    const normalizedEmail = data.email.trim().toLowerCase()

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: data.full_name,
        email: normalizedEmail,
        password: data.password,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      toast.error(body.error ?? 'Erro ao criar conta. Tente novamente.')
      return
    }

    const result = await signIn('credentials', {
      email: normalizedEmail,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error('Conta criada, mas o login automatico falhou por causa da autenticacao.')
      router.push('/login')
      return
    }

    toast.success('Conta criada com sucesso!')
    router.replace('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="full_name" className="text-[var(--color-soft-white-dim)] text-sm">
          Nome completo
        </Label>
        <Input
          id="full_name"
          type="text"
          placeholder="Seu nome"
          autoComplete="name"
          className={inputClass}
          {...register('full_name')}
        />
        {errors.full_name && <p className="text-xs text-red-400">{errors.full_name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[var(--color-soft-white-dim)] text-sm">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          className={inputClass}
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[var(--color-soft-white-dim)] text-sm">
          Senha
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            autoComplete="new-password"
            className={`${inputClass} pr-10`}
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
        {password.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            <PasswordRule met={password.length >= 8} label="8+ caracteres" />
            <PasswordRule met={/[A-Z]/.test(password)} label="Maiuscula" />
            <PasswordRule met={/[0-9]/.test(password)} label="Numero" />
          </div>
        )}
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm_password" className="text-[var(--color-soft-white-dim)] text-sm">
          Confirmar senha
        </Label>
        <div className="relative">
          <Input
            id="confirm_password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="********"
            autoComplete="new-password"
            className={`${inputClass} pr-10`}
            {...register('confirm_password')}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-soft-white-dim)]/50 hover:text-[var(--color-soft-white-dim)] transition-colors"
            aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirm_password && (
          <p className="text-xs text-red-400">{errors.confirm_password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-5 font-semibold bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] disabled:opacity-60 shadow-md shadow-[rgba(201,168,76,0.2)]"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando conta...</>
        ) : (
          'Criar conta'
        )}
      </Button>

      <p className="text-center text-sm text-[var(--color-soft-white-dim)]/60">
        Ja tem uma conta?{' '}
        <Link href="/login" className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors">
          Entrar
        </Link>
      </p>
    </form>
  )
}
