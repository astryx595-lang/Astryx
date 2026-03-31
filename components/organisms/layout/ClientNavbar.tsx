'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Início' },
  { href: '/pedidos', label: 'Meus Pedidos' },
  { href: '/perfil', label: 'Perfil' },
]

export function ClientNavbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="border-b border-[rgba(201,168,76,0.15)] bg-[#0e0120]/90 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-14 gap-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center shrink-0">
            <Image
              src="/images/Logo-with-write-without-background.png"
              alt="Astryx"
              width={130}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-[var(--color-gold)] bg-[rgba(201,168,76,0.08)]'
                      : 'text-[var(--color-soft-white-dim)] hover:text-[var(--color-soft-white)] hover:bg-[rgba(255,255,255,0.04)]',
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Sair */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-[var(--color-soft-white-dim)]/60 hover:text-red-400 hover:bg-red-400/10 gap-1.5 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
