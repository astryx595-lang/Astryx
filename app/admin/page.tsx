import type { Metadata } from 'next'
import { createOrderService } from '@/lib/container'
import { STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS } from '@/constants/services'
import type { OrderStatus } from '@/types/database'
import Link from 'next/link'
import { ShoppingBag, Clock, Sparkles, CheckCircle, ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin — Dashboard' }

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5" />,
  in_progress: <Sparkles className="w-5 h-5" />,
  delivered: <CheckCircle className="w-5 h-5" />,
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(iso))
}

export default async function AdminDashboardPage() {
  const orderService = createOrderService()
  const allOrders = await orderService.getAllOrders()

  const total = allOrders.length
  const pending = allOrders.filter((o) => o.status === 'pending').length
  const inProgress = allOrders.filter((o) => o.status === 'in_progress').length
  const delivered = allOrders.filter((o) => o.status === 'delivered').length
  const revenue = allOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.price_cents, 0)

  const recent = allOrders.slice(0, 5)

  const kpis = [
    { label: 'Total de pedidos', value: total, icon: <ShoppingBag className="w-5 h-5" />, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Aguardando', value: pending, icon: <Clock className="w-5 h-5" />, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Em produção', value: inProgress, icon: <Sparkles className="w-5 h-5" />, color: 'text-[var(--color-gold)]', bg: 'bg-[rgba(201,168,76,0.1)]' },
    { label: 'Entregues', value: delivered, icon: <CheckCircle className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ]

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <p className="text-xs text-[var(--color-gold)] font-medium tracking-widest uppercase">Visão Geral</p>
        <h1 className="font-heading text-4xl font-semibold text-[var(--color-soft-white)]">Dashboard</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.02)] p-5 space-y-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-2xl font-heading font-semibold text-[var(--color-soft-white)]">{kpi.value}</p>
              <p className="text-xs text-[var(--color-soft-white-dim)]/60">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Receita */}
      <div className="rounded-xl border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.04)] p-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--color-gold)] font-medium tracking-widest uppercase mb-1">Receita total</p>
          <p className="font-heading text-3xl font-semibold text-[var(--color-soft-white)]">{formatPrice(revenue)}</p>
        </div>
        <p className="text-sm text-[var(--color-soft-white-dim)]/60">{total - allOrders.filter(o => o.status === 'cancelled').length} pedidos ativos</p>
      </div>

      {/* Pedidos recentes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-[var(--color-soft-white)]">Pedidos recentes</h2>
          <Link href="/admin/pedidos" className="flex items-center gap-1 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors group">
            Ver todos
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="rounded-xl border border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.02)] overflow-hidden">
          {recent.map((order, i) => (
            <Link key={order.id} href={`/admin/pedidos/${order.id}`}>
              <div className={`flex items-center gap-4 px-5 py-4 hover:bg-[rgba(201,168,76,0.04)] transition-colors group ${i !== 0 ? 'border-t border-[rgba(201,168,76,0.06)]' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-soft-white)] truncate">
                    {order.birth_data?.full_name ?? '—'}
                  </p>
                  <p className="text-xs text-[var(--color-soft-white-dim)]/60">
                    {SERVICE_LABELS[order.service_type]} · {formatDate(order.created_at)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
                <p className="text-sm text-[var(--color-gold)] hidden sm:block">{formatPrice(order.price_cents)}</p>
                <ChevronRight className="w-4 h-4 text-[var(--color-soft-white-dim)]/30 group-hover:text-[var(--color-gold)] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
