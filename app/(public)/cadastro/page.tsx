import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { StarfieldCanvas } from '@/components/StarfieldCanvas'
import { RegisterForm } from '@/components/organisms/auth/RegisterForm'

export const metadata: Metadata = { title: 'Criar Conta' }

export default function CadastroPage() {
  return (
    <>
      <StarfieldCanvas />
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Glow de fundo */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(79,70,229,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center group">
              <Image
                src="/images/Logo-with-write-without-background.png"
                alt="Astryx"
                width={130}
                height={40}
                className="h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
              />
            </Link>
            <h1 className="font-heading text-3xl font-semibold text-[var(--color-soft-white)]">
              Crie sua conta
            </h1>
            <p className="text-sm text-[var(--color-soft-white-dim)]/70">
              Acompanhe seus pedidos e acesse seus mapas
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[rgba(26,5,51,0.7)] backdrop-blur-sm p-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  )
}
