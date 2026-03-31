import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail invalido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100),
  email: z.string().trim().toLowerCase().email('E-mail invalido'),
  password: z.string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiuscula')
    .regex(/[0-9]/, 'Deve conter ao menos um numero'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'As senhas nao coincidem',
  path: ['confirm_password'],
})

export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
