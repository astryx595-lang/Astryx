'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

export function CtaSection() {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="relative rounded-3xl overflow-hidden border border-[rgba(201,168,76,0.25)] p-12 md:p-16 text-center"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Fundo gradiente */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(79,70,229,0.15) 0%, rgba(26,5,51,0.95) 60%, rgba(14,1,32,1) 100%)',
            }}
          />

          {/* Estrelas decorativas animadas */}
          <motion.div
            className="absolute top-6 left-10"
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Star className="w-4 h-4 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
          </motion.div>
          <motion.div
            className="absolute top-10 right-16"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
          >
            <Star className="w-3 h-3 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-20"
            animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
          >
            <Star className="w-3 h-3 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
          </motion.div>

          {/* Conteúdo */}
          <div className="relative z-10 space-y-7">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.06)] text-xs font-medium tracking-widest uppercase text-[var(--color-gold)]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Comece Agora
            </motion.div>

            <motion.h2
              className="font-heading text-4xl md:text-5xl font-semibold text-[var(--color-soft-white)] leading-tight"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Seu mapa astral espera por você
            </motion.h2>

            <motion.p
              className="text-[var(--color-soft-white-dim)] text-lg max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Dê o primeiro passo no seu autoconhecimento. Uma leitura profunda,
              feita exclusivamente para você.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/cadastro">
                <Button
                  size="lg"
                  className="px-10 py-6 text-base font-semibold bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] shadow-lg shadow-[rgba(201,168,76,0.3)] transition-all duration-300 hover:shadow-xl hover:shadow-[rgba(201,168,76,0.45)] hover:scale-[1.03] active:scale-[0.98]"
                >
                  Criar Minha Conta
                </Button>
              </Link>
              <Link href="/servicos">
                <Button
                  size="lg"
                  variant="ghost"
                  className="px-8 py-6 text-base text-[var(--color-soft-white-dim)] hover:text-[var(--color-soft-white)] border border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.4)] hover:bg-[rgba(201,168,76,0.05)] transition-all duration-300"
                >
                  Ver Serviços
                </Button>
              </Link>
            </motion.div>

            <motion.p
              className="text-xs text-[var(--color-soft-white-dim)]/50"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Entrega em até 5 dias úteis · PDF personalizado · Suporte via mensagem
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
