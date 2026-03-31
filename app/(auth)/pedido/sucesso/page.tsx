import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, CheckCircle } from 'lucide-react'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Pedido Confirmado' }

function SuccessContent() {
  return (
    <div className="text-center space-y-8 max-w-md mx-auto">
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-[var(--color-gold)]" />
          </div>
          {[...Array(6)].map((_, i) => (
            <Star
              key={i}
              className="absolute w-3 h-3 text-[var(--color-gold)] opacity-60"
              fill="currentColor"
              style={{
                top: `${50 + 55 * Math.sin((i * Math.PI * 2) / 6)}%`,
                left: `${50 + 55 * Math.cos((i * Math.PI * 2) / 6)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="font-heading text-4xl font-semibold text-[var(--color-soft-white)]">
          Pedido confirmado!
        </h1>
        <p className="text-[var(--color-soft-white-dim)] leading-relaxed">
          Seu pedido foi recebido com sucesso. Nossa astróloga já está trabalhando no seu mapa
          e você receberá uma notificação quando estiver pronto.
        </p>
      </div>

      <div className="rounded-xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.04)] p-5 text-sm text-[var(--color-soft-white-dim)] space-y-2">
        <p>
          <span className="text-[var(--color-gold)]">Prazo de entrega:</span> até 5 dias úteis
        </p>
        <p>
          <span className="text-[var(--color-gold)]">Entrega:</span> PDF disponível na sua área do cliente
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
        <Link href="/pedidos">
          <Button className="bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] font-semibold">
            Acompanhar pedido
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" className="text-[var(--color-soft-white-dim)] hover:text-[var(--color-soft-white)] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.3)]">
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function SucessoPage() {
  return (
    <div className="flex items-center justify-center py-10">
      <Suspense>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
