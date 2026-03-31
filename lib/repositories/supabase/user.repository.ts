import type { IUserRepository } from '../interfaces'
import type { User, CreateUserDTO, UpdateUserDTO } from '@/types/database'
import { supabaseAdminRequest } from '@/lib/supabase/server'

type SupabaseUserRow = User

function mapUser(row: SupabaseUserRow): User {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    phone: row.phone,
    role: row.role,
    avatar_url: row.avatar_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function findUserByQuery(query: string): Promise<User | null> {
  const data = await supabaseAdminRequest(`/rest/v1/users?select=*&${query}&limit=1`)
  if (!Array.isArray(data) || data.length === 0) return null
  return mapUser(data[0] as SupabaseUserRow)
}

export class SupabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return findUserByQuery(`id=eq.${encodeURIComponent(id)}`)
  }

  async findByEmail(email: string): Promise<User | null> {
    return findUserByQuery(`email=eq.${encodeURIComponent(email.trim().toLowerCase())}`)
  }

  async findByEmailWithHash(): Promise<(User & { password_hash: string }) | null> {
    return null
  }

  async create(data: CreateUserDTO): Promise<User> {
    const normalizedEmail = data.email.trim().toLowerCase()

    const createdAuthUser = await supabaseAdminRequest('/auth/v1/admin/users', {
      method: 'POST',
      body: {
        email: normalizedEmail,
        password: data.password_hash,
        email_confirm: true,
        user_metadata: {
          full_name: data.full_name,
        },
      },
    })

    const authUserId =
      (createdAuthUser?.user?.id as string | undefined) ??
      (createdAuthUser?.id as string | undefined)
    if (!authUserId) {
      throw new Error('Supabase did not return the created user id.')
    }

    const existingProfile = await this.findById(authUserId)
    if (existingProfile) return existingProfile

    const inserted = await supabaseAdminRequest('/rest/v1/users', {
      method: 'POST',
      headers: {
        Prefer: 'return=representation',
      },
      body: {
        id: authUserId,
        email: normalizedEmail,
        full_name: data.full_name,
        role: data.role ?? 'client',
      },
    })

    if (!Array.isArray(inserted) || inserted.length === 0) {
      throw new Error('Supabase did not return the created user profile.')
    }

    return mapUser(inserted[0] as SupabaseUserRow)
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const updated = await supabaseAdminRequest(`/rest/v1/users?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        Prefer: 'return=representation',
      },
      body: data,
    })

    if (!Array.isArray(updated) || updated.length === 0) {
      throw new Error(`Usuario ${id} nao encontrado`)
    }

    return mapUser(updated[0] as SupabaseUserRow)
  }
}
