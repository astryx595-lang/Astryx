import type { IUserRepository } from '../interfaces'
import type { User, CreateUserDTO, UpdateUserDTO } from '@/types/database'

// Persiste no globalThis para sobreviver ao isolamento de módulos do Next.js
const g = globalThis as typeof globalThis & {
  __astryx_users__?: (User & { password_hash: string })[]
}
if (!g.__astryx_users__) {
  g.__astryx_users__ = [
    {
      id: 'admin-1',
      email: 'admin@astryx.com.br',
      full_name: 'Admin Astryx',
      role: 'admin',
      password_hash: '$2b$12$SmGNq5hbJoYQ3XxCs1QYHe1xfDc.80Vzx78pOezeTY2KobypJ/4Cy', // admin123
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}
const USERS_STORE = g.__astryx_users__!

export class MockUserRepository implements IUserRepository {
  private users = USERS_STORE

  async findById(id: string): Promise<User | null> {
    const u = this.users.find((u) => u.id === id)
    if (!u) return null
    const { password_hash: _, ...user } = u
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const u = this.users.find((u) => u.email === email)
    if (!u) return null
    const { password_hash: _, ...user } = u
    return user
  }

  async findByEmailWithHash(email: string): Promise<(User & { password_hash: string }) | null> {
    return this.users.find((u) => u.email === email) ?? null
  }

  async create(data: CreateUserDTO): Promise<User> {
    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      role: data.role ?? 'client' as const,
      password_hash: data.password_hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.users.push(newUser)
    const { password_hash: _, ...user } = newUser
    return user
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const idx = this.users.findIndex((u) => u.id === id)
    if (idx === -1) throw new Error(`Usuário ${id} não encontrado`)
    this.users[idx] = { ...this.users[idx], ...data, updated_at: new Date().toISOString() }
    const { password_hash: _, ...user } = this.users[idx]
    return user
  }
}
