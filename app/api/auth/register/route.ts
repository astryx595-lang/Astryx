import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createUserRepository } from '@/lib/container'

const schema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados invalidos.' }, { status: 400 })
  }

  const { full_name, email, password } = parsed.data
  const userRepo = createUserRepository()

  try {
    const existing = await userRepo.findByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Este e-mail ja esta cadastrado.' }, { status: 409 })
    }

    await userRepo.create({ full_name, email, password_hash: password, role: 'client' })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar conta.'
    const normalized = message.toLowerCase()

    if (normalized.includes('already') || normalized.includes('exists') || normalized.includes('registered')) {
      return NextResponse.json({ error: 'Este e-mail ja esta cadastrado.' }, { status: 409 })
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
