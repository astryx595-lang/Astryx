import type { Metadata } from 'next'
import { OrderFormWizard } from '@/components/organisms/pedido/OrderFormWizard'

export const metadata: Metadata = { title: 'Solicitar Mapa Astral' }

export default function PedidoPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10 space-y-3">
        <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-gold)]">
          Novo Pedido
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-[var(--color-soft-white)]">
          Solicite seu mapa astral
        </h1>
        <p className="text-[var(--color-soft-white-dim)] max-w-md mx-auto">
          Preencha os dados abaixo e nossa astróloga iniciará a elaboração do seu mapa.
        </p>
      </div>

      <OrderFormWizard />
    </div>
  )
}
