'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.25,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Nebula glow de fundo */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(79,70,229,0.18) 0%, rgba(124,58,237,0.10) 40%, transparent 70%)',
        }}
      />

      {/* Conteúdo */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Pill badge */}
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.06)] text-xs font-medium tracking-widest uppercase text-[var(--color-gold)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
          Astrologia de Alta Precisão
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="font-heading text-5xl sm:text-6xl md:text-7xl font-semibold leading-tight text-[var(--color-soft-white)]"
        >
          Descubra quem{' '}
          <span className="text-gradient-gold italic">você realmente é</span>{' '}
          através das estrelas
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={item}
          className="text-lg text-[var(--color-soft-white-dim)] max-w-xl mx-auto leading-relaxed"
        >
          Mapas astrais elaborados com profundidade, cuidado e precisão
          astrológica. Uma leitura única, feita exclusivamente para você.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link href="/cadastro">
            <Button
              size="lg"
              className="px-8 py-6 text-base font-semibold bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] shadow-lg shadow-[rgba(201,168,76,0.25)] transition-all duration-300 hover:shadow-[rgba(201,168,76,0.4)] hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]"
            >
              Criar Conta Gratuitamente
            </Button>
          </Link>
          <Link href="/servicos">
            <Button
              size="lg"
              variant="ghost"
              className="px-8 py-6 text-base font-medium text-[var(--color-soft-white-dim)] border border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.5)] hover:text-[var(--color-soft-white)] hover:bg-[rgba(201,168,76,0.05)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              Conhecer os Serviços
            </Button>
          </Link>
        </motion.div>

        {/* Social proof mini */}
        <motion.p variants={item} className="text-sm text-[var(--color-soft-white-dim)]/60">
          Mais de <span className="text-[var(--color-gold)]">500 mapas</span> entregues com excelência
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--color-soft-white-dim)]/40"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="text-xs tracking-widest uppercase">Explore</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
