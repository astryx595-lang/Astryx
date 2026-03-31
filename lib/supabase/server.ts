const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required Supabase environment variable: ${name}`)
  }
  return value
}

function buildUrl(path: string): string {
  return `${requireEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl).replace(/\/$/, '')}${path}`
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH'
  body?: unknown
  headers?: Record<string, string>
}

async function request(path: string, apiKey: string, options: RequestOptions = {}) {
  const response = await fetch(buildUrl(path), {
    method: options.method ?? 'GET',
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      data?.msg ??
      data?.error_description ??
      data?.error ??
      `Supabase request failed with status ${response.status}`
    throw new Error(message)
  }

  return data
}

export async function supabaseAdminRequest(path: string, options: RequestOptions = {}) {
  return request(path, requireEnv('SUPABASE_SERVICE_ROLE_KEY', supabaseServiceRoleKey), options)
}

export async function supabaseAnonRequest(path: string, options: RequestOptions = {}) {
  return request(path, requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey), options)
}

