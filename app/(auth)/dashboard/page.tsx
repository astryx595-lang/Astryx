'use client'

import type { Metadata } from 'next'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Plus,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS } from '@/constants/services'
import type { Order } from '@/types/database'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(iso))
}

function StatusBadge({ status }: { status: Order['status'] }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pedidos')
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Bem-vinda'
  const recent = orders.slice(0, 4)

  const stats = [
    {
      label: 'Total de pedidos',
      value: orders.length,
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10',
    },
    {
      label: 'Aguardando',
      value: orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      label: 'Em produção',
      value: orders.filter((o) => o.status === 'in_progress').length,
      icon: <Sparkles className="w-5 h-5" />,
      color: 'text-[var(--color-gold)]',
      bg: 'bg-[rgba(201,168,76,0.1)]',
    },
    {
      label: 'Entregues',
      value: orders.filter((o) => o.status === 'delivered').length,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
  ]

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Cabeçalho */}
      <motion.div variants={item} className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <p className="text-xs text-[var(--color-gold)] font-medium tracking-widest uppercase">
            Área do Cliente
          </p>
          <h1 className="font-heading text-4xl font-semibold text-[var(--color-soft-white)]">
            Olá, {firstName}
          </h1>
          <p className="text-[var(--color-soft-white-dim)] text-sm">
            Acompanhe seus pedidos e faça o download dos seus mapas.
          </p>
        </div>
        <Link href="/pedido">
          <Button className="bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] font-semibold gap-2 shrink-0 hover:scale-[1.03] transition-all duration-200">
            <Plus className="w-4 h-4" />
            Novo mapa
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.02)] p-4 space-y-3"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg} ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-heading font-semibold text-[var(--color-soft-white)]">
                {loading ? '—' : s.value}
              </p>
              <p className="text-xs text-[var(--color-soft-white-dim)]/60">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* CTA Solicitar novo mapa */}
      <motion.div
        variants={item}
        className="rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.04)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[rgba(201,168,76,0.15)] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[var(--color-gold)]" />
          </div>
          <div>
            <p className="font-medium text-[var(--color-soft-white)]">Solicitar novo mapa astral</p>
            <p className="text-sm text-[var(--color-soft-white-dim)]/70">
              Básico, Completo, Sinastria ou Revolução Solar.
            </p>
          </div>
        </div>
        <Link href="/pedido">
          <Button
            variant="ghost"
            className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)] hover:bg-[rgba(201,168,76,0.08)] gap-2 border border-[rgba(201,168,76,0.25)] hover:border-[rgba(201,168,76,0.5)] shrink-0"
          >
            Solicitar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Pedidos recentes */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-[var(--color-soft-white)]">
            Pedidos recentes
          </h2>
          {orders.length > 4 && (
            <Link href="/pedidos">
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)] gap-1 group"
              >
                Ver todos
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.02)] p-10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-2xl border border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.02)] p-12 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-[var(--color-soft-white-dim)]/30" />
            </div>
            <div>
              <p className="font-medium text-[var(--color-soft-white-dim)]">Nenhum pedido ainda</p>
              <p className="text-sm text-[var(--color-soft-white-dim)]/60 mt-1">
                Solicite seu primeiro mapa astral e comece sua jornada.
              </p>
            </div>
            <Link href="/pedido">
              <Button className="bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] font-semibold gap-2">
                <Plus className="w-4 h-4" />
                Solicitar Mapa
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.02)] overflow-hidden">
            {recent.map((order, i) => (
              <Link key={order.id} href={`/pedidos/${order.id}`}>
                <div
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-[rgba(201,168,76,0.04)] transition-colors group ${
                    i !== 0 ? 'border-t border-[rgba(201,168,76,0.06)]' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[var(--color-gold)]/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-soft-white)] truncate">
                      {SERVICE_LABELS[order.service_type]}
                    </p>
                    <p className="text-xs text-[var(--color-soft-white-dim)]/60 mt-0.5">
                      {order.birth_data?.full_name ?? '—'} · {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={order.status} />
                    <p className="text-sm text-[var(--color-gold)] hidden sm:block">
                      {formatPrice(order.price_cents)}
                    </p>
                    <ChevronRight className="w-4 h-4 text-[var(--color-soft-white-dim)]/20 group-hover:text-[var(--color-gold)] transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
