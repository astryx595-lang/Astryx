import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { createUserRepository } from '@/lib/container'
import { loginSchema } from '@/lib/validations/auth'
import { supabaseAnonRequest } from '@/lib/supabase/server'

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV !== 'production' ? 'dev-only-auth-secret-change-in-production' : undefined)

const userRepo = createUserRepository()

export const authConfig: NextAuthConfig = {
  secret: authSecret,
  trustHost: true,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        try {
          const authSession = await supabaseAnonRequest('/auth/v1/token?grant_type=password', {
            method: 'POST',
            body: {
              email: parsed.data.email,
              password: parsed.data.password,
            },
          })

          const authUserId = authSession?.user?.id as string | undefined
          if (!authUserId) return null

          const profile = await userRepo.findById(authUserId)
          if (!profile) return null

          return {
            id: profile.id,
            email: profile.email,
            name: profile.full_name,
            role: profile.role,
            avatar_url: profile.avatar_url ?? null,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.avatar_url = (user as { avatar_url?: string | null }).avatar_url ?? undefined
      }
      if (trigger === 'update' && updateSession?.avatar_url !== undefined) {
        token.avatar_url = updateSession.avatar_url
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.avatar_url = token.avatar_url as string | undefined
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
}
