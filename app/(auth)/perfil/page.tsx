'use client'

import { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, User, Camera } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations/auth'

const inputClass =
  'bg-[rgba(255,255,255,0.04)] border-[rgba(201,168,76,0.2)] text-[var(--color-soft-white)] placeholder:text-[var(--color-soft-white-dim)]/40 focus-visible:border-[var(--color-gold)] focus-visible:ring-[var(--color-gold)]/20'

export default function PerfilPage() {
  const { data: session, update } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: session?.user.name ?? '',
    },
  })

  const onSubmit = async (data: UpdateProfileInput) => {
    const res = await fetch(`/api/usuarios/${session?.user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      toast.error('Erro ao salvar. Tente novamente.')
      return
    }

    await update({ name: data.full_name })
    toast.success('Perfil atualizado!')
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    setUploadingAvatar(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch(`/api/usuarios/${session?.user.id}/avatar`, {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error ?? 'Erro ao enviar imagem.')
        setPreviewUrl(null)
        return
      }

      await update({ avatar_url: json.avatar_url })
      toast.success('Avatar atualizado!')
    } catch {
      toast.error('Erro ao enviar imagem.')
      setPreviewUrl(null)
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const avatarSrc = previewUrl ?? session?.user.avatar_url ?? null

  return (
    <div className="space-y-8 max-w-lg">
      <div className="space-y-1">
        <p className="text-sm text-[var(--color-gold)] font-medium tracking-widest uppercase">
          Configurações
        </p>
        <h1 className="font-heading text-4xl font-semibold text-[var(--color-soft-white)]">
          Meu Perfil
        </h1>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="w-16 h-16 rounded-full overflow-hidden bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            aria-label="Alterar avatar"
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="Avatar"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <User className="w-7 h-7 text-[var(--color-gold)]" />
            )}

            {/* Overlay */}
            <span className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploadingAvatar ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div>
          <p className="font-medium text-[var(--color-soft-white)]">{session?.user.name}</p>
          <p className="text-sm text-[var(--color-soft-white-dim)]/60">{session?.user.email}</p>
          <p className="text-xs text-[var(--color-soft-white-dim)]/40 mt-0.5">
            Clique na foto para alterar
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="rounded-2xl border border-[rgba(201,168,76,0.1)] bg-[rgba(255,255,255,0.02)] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-[var(--color-soft-white-dim)] text-sm">
              Nome completo
            </Label>
            <Input
              id="full_name"
              className={inputClass}
              {...register('full_name')}
            />
            {errors.full_name && (
              <p className="text-xs text-red-400">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[var(--color-soft-white-dim)] text-sm">
              WhatsApp <span className="text-[var(--color-soft-white-dim)]/50">(opcional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+55 11 99999-9999"
              className={inputClass}
              {...register('phone')}
            />
          </div>

          {/* E-mail (somente leitura) */}
          <div className="space-y-1.5">
            <Label className="text-[var(--color-soft-white-dim)] text-sm">E-mail</Label>
            <Input
              value={session?.user.email ?? ''}
              disabled
              className="bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] text-[var(--color-soft-white-dim)]/50 cursor-not-allowed"
            />
            <p className="text-xs text-[var(--color-soft-white-dim)]/40">
              O e-mail não pode ser alterado.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="bg-[var(--color-gold)] text-[#0e0120] hover:bg-[var(--color-gold-light)] font-semibold disabled:opacity-50"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
            ) : (
              'Salvar alterações'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
