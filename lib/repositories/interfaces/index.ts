import type {
  User,
  Order,
  AstralChart,
  OrderFilters,
  CreateOrderDTO,
  UpdateUserDTO,
  CreateUserDTO,
  OrderStatus,
} from '@/types/database'

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByEmailWithHash(email: string): Promise<(User & { password_hash: string }) | null>
  create(data: CreateUserDTO): Promise<User>
  update(id: string, data: UpdateUserDTO): Promise<User>
}

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>
  findByUserId(userId: string): Promise<Order[]>
  findAll(filters?: OrderFilters): Promise<Order[]>
  count(filters?: OrderFilters): Promise<number>
  create(userId: string, data: CreateOrderDTO, priceCents: number): Promise<Order>
  updateStatus(id: string, status: OrderStatus, adminId: string, reason?: string): Promise<Order>
  updateAdminNotes(id: string, notes: string): Promise<Order>
}

export interface IChartRepository {
  findByOrderId(orderId: string): Promise<AstralChart | null>
  upload(orderId: string, file: Buffer, filename: string, adminId: string): Promise<AstralChart>
  getSignedDownloadUrl(chartId: string, expiresInSeconds?: number): Promise<string>
  incrementDownloadCount(chartId: string): Promise<void>
}

export interface IMailService {
  sendOrderConfirmation(order: Order): Promise<void>
  sendDeliveryNotification(order: Order): Promise<void>
  sendPasswordReset(email: string, token: string): Promise<void>
}
