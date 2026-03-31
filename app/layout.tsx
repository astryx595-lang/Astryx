import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Astryx — Mapas Astrais Premium',
    template: '%s | Astryx',
  },
  description:
    'Descubra sua essência através de um mapa astral elaborado com profundidade, cuidado e precisão. Astrologia de alta qualidade para seu autoconhecimento.',
  keywords: ['mapa astral', 'astrologia', 'autoconhecimento', 'signos', 'horóscopo'],
  authors: [{ name: 'Astryx' }],
  icons: {
    icon: '/images/Just-logo.png',
    apple: '/images/Just-logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Astryx',
    title: 'Astryx — Mapas Astrais Premium',
    description: 'Descubra sua essência através de um mapa astral elaborado com profundidade e precisão.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased" suppressHydrationWarning>
        <SessionProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
