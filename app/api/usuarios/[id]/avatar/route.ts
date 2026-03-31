import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createUserRepository } from '@/lib/container'

const BUCKET = 'avatars'
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params

  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  if (session.user.id !== id && session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  }

  const formData = await req.formData().catch(() => null)
  const file = formData?.get('avatar') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Arquivo não enviado.' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Formato inválido. Use JPEG, PNG ou WebP.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Imagem muito grande. Máximo 2 MB.' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Configuração do servidor incompleta.' }, { status: 500 })
  }

  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const objectPath = `${id}/avatar.${ext}`

  const buffer = await file.arrayBuffer()

  const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: 'PUT',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': file.type,
      'x-upsert': 'true',
    },
    body: buffer,
  })

  if (!uploadRes.ok) {
    const err = await uploadRes.text()
    console.error('Supabase Storage error:', err)
    return NextResponse.json({ error: 'Erro ao fazer upload da imagem.' }, { status: 500 })
  }

  const avatar_url = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${objectPath}`

  const userRepo = createUserRepository()
  await userRepo.update(id, { avatar_url })

  return NextResponse.json({ avatar_url })
}
