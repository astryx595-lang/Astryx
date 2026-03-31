import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, Sparkles, Moon, Sun, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SERVICE_LABELS, SERVICE_DESCRIPTIONS, PRICE_TABLE } from '@/constants/services'
import type { ServiceType } from '@/types/database'

export const metadata: Metadata = {
  title: 'Serviços',
  description: 'Conheça todos os tipos de mapa astral disponíveis: Básico, Completo, Sinastria e Revolução Solar.',
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

const SERVICES: {
  type: ServiceType
  icon: React.ReactNode
  highlight?: boolean
  deliveryDays: number
  includes: string[]
}[] = [
  {
    type: 'basic',
    icon: <Star className="w-7 h-7" />,
    deliveryDays: 5,
    includes: [
      'Análise do Sol, Lua e Ascendente',
      'Interpretação dos aspectos principais',
      'Elementos e modalidades predominantes',
      'Relatório em PDF de 15 a 25 páginas',
    ],
  },
  {
    type: 'complete',
    icon: <Sparkles className="w-7 h-7" />,
    highlight: true,
    deliveryDays: 5,
    includes: [
      'Todos os 10 planetas interpretados',
      'Análise das 12 casas astrológicas',
      'Aspectos entre planetas (maiores e menores)',
      'Padrões de configuração planetária',
      'Eixos do mapa (MC/IC, Asc/Desc)',
      'Relatório em PDF de 40 a 60 páginas',
    ],
  },
  {
    type: 'synastry',
    icon: <Moon className="w-7 h-7" />,
    deliveryDays: 7,
    includes: [
      'Comparação de dois mapas astrais completos',
      'Aspectos interplanetários entre os mapas',
      'Pontos de harmonia e tensão na relação',
      'Análise de casas compostas',
      'Ideal para casais, amizades e sócios',
      'Relatório em PDF de 35 a 55 páginas',
    ],
  },
  {
    type: 'solar_return',
    icon: <Sun className="w-7 h-7" />,
    deliveryDays: 5,
    includes: [
      'Mapa do retorno solar (seu aniversário)',
      'Tendências e temas do ano em curso',
      'Planetas em destaque no ciclo',
      'Áreas de vida mais ativadas',
      'Oportunidades e desafios do período',
      'Relatório em PDF de 20 a 35 páginas',
    ],
  },
]

const PROCESS = [
  { step: '01', title: 'Solicite', desc: 'Preencha o formulário com seus dados e escolha o tipo de mapa.' },
  { step: '02', title: 'Produção', desc: 'Nossa astróloga elabora sua leitura com atenção e profundidade.' },
  { step: '03', title: 'Entrega', desc: 'Você recebe o PDF na sua área do cliente dentro do prazo.' },
]

export default function ServicosPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 px-4 text-center">
        <div className="container mx-auto max-w-3xl space-y-4">
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-gold)]">
            O que oferecemos
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-semibold text-[var(--color-soft-white)]">
            Serviços & Preços
          </h1>
          <p className="text-[var(--color-soft-white-dim)] text-lg max-w-xl mx-auto leading-relaxed">
            Cada mapa é elaborado individualmente, com interpretação aprofundada
            e entregue em PDF completo.
          </p>
        </div>
      </section>

      {/* Cards de serviços */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map(({ type, icon, highlight, deliveryDays, includes }) => (
            <div
              key={type}
              className={`relative rounded-2xl border flex flex-col p-7 gap-6 transition-all duration-300 ${
                highlight
                  ? 'border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.06)] gold-glow'
                  : 'border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.02)]'
              }`}
            >
              {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-gold)] text-[#0e0120] text-xs font-semibold whitespace-nowrap">
                  Mais Completo
                </div>
              )}

              {/* Ícone + título */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${highlight ? 'bg-[rgba(201,168,76,0.2)] text-[var(--color-gold)]' : 'bg-[rgba(255,255,255,0.06)] text-[var(--color-soft-white-dim)]'}`}>
                    {icon}
                  </div>
                  <h2 className="font-heading text-2xl font-semibold text-[var(--color-soft-white)]">
                    {SERVICE_LABELS[type]}
                  </h2>
                  <p className="text-sm text-[var(--color-soft-white-dim)] leading-relaxed">
                    {SERVICE_DESCRIPTIONS[type]}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-heading text-3xl font-semibold text-[var(--color-gold)]">
                    {formatPrice(PRICE_TABLE[type])}
                  </p>
                  <p className="text-xs text-[var(--color-soft-white-dim)]/60 mt-0.5">pagamento único</p>
                  <p className="text-xs text-[var(--color-soft-white-dim)]/50 mt-0.5">
                    Entrega em {deliveryDays} dias úteis
                  </p>
                </div>
              </div>

              {/* Lista de inclusões */}
              <ul className="space-y-2.5 flex-1">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-soft-white-dim)]">
                    <Check className="w-4 h-4 text-[var(--color-gold)] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/login">
                <Button
                  className={`w-full font-semibold ${
                    highlight
                      ? 'bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] shadow-md shadow-[rgba(201,168,76,0.25)]'
                      : 'border border-[rgba(201,168,76,0.3)] text-[var(--color-soft-white-dim)] hover:border-[rgba(201,168,76,0.6)] hover:text-[var(--color-soft-white)] bg-transparent hover:bg-[rgba(201,168,76,0.05)]'
                  }`}
                >
                  Entrar para solicitar
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-4 border-t border-[rgba(201,168,76,0.1)]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14 space-y-3">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-gold)]">Processo</p>
            <h2 className="font-heading text-4xl font-semibold text-[var(--color-soft-white)]">Como funciona</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS.map(({ step, title, desc }) => (
              <div key={step} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.06)] flex items-center justify-center mx-auto">
                  <span className="font-heading text-xl font-semibold text-[var(--color-gold)]">{step}</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-[var(--color-soft-white)]">{title}</h3>
                <p className="text-sm text-[var(--color-soft-white-dim)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-md space-y-6">
          <h2 className="font-heading text-3xl font-semibold text-[var(--color-soft-white)]">
            Pronta para começar?
          </h2>
          <Link href="/cadastro">
            <Button className="px-10 py-5 bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] font-semibold shadow-lg shadow-[rgba(201,168,76,0.25)]">
              Criar Minha Conta
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
