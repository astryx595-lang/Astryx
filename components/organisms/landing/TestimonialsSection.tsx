'use client'

import { Star } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const TESTIMONIALS = [
  {
    name: 'Ana Beatriz',
    sign: 'Escorpião',
    text: 'O mapa astral me ajudou a entender padrões que eu repetia há anos sem perceber. A análise foi profunda e muito precisa. Recomendo de olhos fechados.',
    service: 'Mapa Completo',
    avatar: 'A',
  },
  {
    name: 'Juliana Mota',
    sign: 'Touro',
    text: 'Presenteei meu parceiro com a sinastria e ficamos impressionados com a precisão. Identificou pontos de tensão e harmonia que fazem total sentido na nossa relação.',
    service: 'Sinastria',
    avatar: 'J',
  },
  {
    name: 'Camila Torres',
    sign: 'Sagitário',
    text: 'Fiz a revolução solar no meu aniversário e foi incrível como as tendências descritas se confirmaram no decorrer do ano. Vale cada centavo.',
    service: 'Revolução Solar',
    avatar: 'C',
  },
  {
    name: 'Renata Lima',
    sign: 'Peixes',
    text: 'A linguagem é acessível e ao mesmo tempo muito completa. Não é aquele material genérico de internet — é algo realmente personalizado e pensado para mim.',
    service: 'Mapa Básico',
    avatar: 'R',
  },
  {
    name: 'Fernanda Souza',
    sign: 'Virgem',
    text: 'Recebi o mapa em PDF com todo o cuidado e detalhamento que eu esperava. Um trabalho de muita qualidade. Já indiquei para várias amigas.',
    service: 'Mapa Completo',
    avatar: 'F',
  },
  {
    name: 'Mariana Alves',
    sign: 'Libra',
    text: 'Estava num momento de transição e o mapa me trouxe clareza sobre meus talentos e desafios. Mudou minha perspectiva sobre mim mesma.',
    service: 'Mapa Completo',
    avatar: 'M',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5 text-[var(--color-gold)]"
          fill="currentColor"
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative z-10 py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Separador decorativo */}
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.3)]" />
          <div className="text-center space-y-2">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-gold)]">
              Depoimentos
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[var(--color-soft-white)]">
              O que dizem nossos clientes
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(201,168,76,0.3)]" />
        </motion.div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl p-6 flex flex-col gap-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(201,168,76,0.1)] hover:border-[rgba(201,168,76,0.25)] transition-colors duration-300 cursor-default"
            >
              <Stars />

              <blockquote className="text-sm text-[var(--color-soft-white-dim)] leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-2 border-t border-[rgba(201,168,76,0.08)]">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold bg-[rgba(201,168,76,0.15)] text-[var(--color-gold)] shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-soft-white)]">{t.name}</p>
                  <p className="text-xs text-[var(--color-soft-white-dim)]/60">
                    {t.sign} · {t.service}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
