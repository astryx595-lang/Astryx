/**
 * Composição de dependências (DI manual).
 *
 * Para migrar ao Supabase:
 *   1. Crie lib/repositories/supabase/*.repository.ts
 *   2. Substitua MockXRepository por SupabaseXRepository abaixo
 *   3. Passe o createSupabaseServerClient() como argumento
 *
 * Nenhuma página ou componente precisa mudar.
 */
import { MockOrderRepository } from './repositories/mock/order.repository'
import { NoopMailService } from './repositories/mock/mail.service'
import { SupabaseUserRepository } from './repositories/supabase/user.repository'
import { OrderService } from './services/order.service'

export function createOrderService(): OrderService {
  return new OrderService(
    new MockOrderRepository(),
    new NoopMailService(),
  )
}

export function createUserRepository() {
  return new SupabaseUserRepository()
}
