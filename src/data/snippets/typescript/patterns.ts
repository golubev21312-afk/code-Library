import type { Snippet } from '@/types'

export const patterns: Snippet[] = [
  {
    id: 'ts-builder-pattern',
    title: 'Builder Pattern',
    description: 'Паттерн строитель с типизацией',
    code: `// Builder с отслеживанием установленных свойств
interface UserData {
  name: string
  email: string
  age?: number
  role?: 'admin' | 'user'
}

type RequiredKeys = 'name' | 'email'

class UserBuilder<T extends Partial<UserData> = {}> {
  private data: T = {} as T

  setName(name: string): UserBuilder<T & { name: string }> {
    return Object.assign(this, { data: { ...this.data, name } })
  }

  setEmail(email: string): UserBuilder<T & { email: string }> {
    return Object.assign(this, { data: { ...this.data, email } })
  }

  setAge(age: number): UserBuilder<T & { age: number }> {
    return Object.assign(this, { data: { ...this.data, age } })
  }

  setRole(role: 'admin' | 'user'): UserBuilder<T & { role: string }> {
    return Object.assign(this, { data: { ...this.data, role } })
  }

  // Доступен только когда все required поля установлены
  build(
    this: UserBuilder<T & Pick<UserData, RequiredKeys>>
  ): UserData {
    return this.data as UserData
  }
}

// Использование
const user = new UserBuilder()
  .setName('John')
  .setEmail('john@example.com')
  .setAge(30)
  .build() // ✅ OK

const invalid = new UserBuilder()
  .setName('John')
  // .build() // ❌ Error: Property 'build' does not exist

// Fluent Builder с generics
class QueryBuilder<T> {
  private query: string[] = []

  select<K extends keyof T>(...fields: K[]): this {
    this.query.push(\`SELECT \${fields.join(', ')}\`)
    return this
  }

  where(condition: Partial<T>): this {
    const conditions = Object.entries(condition)
      .map(([k, v]) => \`\${k} = '\${v}'\`)
      .join(' AND ')
    this.query.push(\`WHERE \${conditions}\`)
    return this
  }

  build(): string {
    return this.query.join(' ')
  }
}

interface Post { id: number; title: string; author: string }

const query = new QueryBuilder<Post>()
  .select('id', 'title')
  .where({ author: 'John' })
  .build()`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'patterns', 'builder', 'fluent'],
    whyRelevant2026: 'Type-safe builders предотвращают ошибки на этапе компиляции',
    related: ['ts-factory-pattern', 'ts-chain-pattern']
  },
  {
    id: 'ts-factory-pattern',
    title: 'Factory Pattern',
    description: 'Фабрика с типизацией и регистрацией',
    code: `// Базовый интерфейс
interface Notification {
  type: string
  send(message: string): void
}

// Реализации
class EmailNotification implements Notification {
  type = 'email' as const
  constructor(private to: string) {}
  send(message: string) {
    console.log(\`Email to \${this.to}: \${message}\`)
  }
}

class SMSNotification implements Notification {
  type = 'sms' as const
  constructor(private phone: string) {}
  send(message: string) {
    console.log(\`SMS to \${this.phone}: \${message}\`)
  }
}

class PushNotification implements Notification {
  type = 'push' as const
  constructor(private deviceId: string) {}
  send(message: string) {
    console.log(\`Push to \${this.deviceId}: \${message}\`)
  }
}

// Типы для фабрики
type NotificationConfig = {
  email: { to: string }
  sms: { phone: string }
  push: { deviceId: string }
}

type NotificationType = keyof NotificationConfig

// Фабрика с registry
class NotificationFactory {
  private static registry = new Map<
    NotificationType,
    new (config: any) => Notification
  >()

  static register<T extends NotificationType>(
    type: T,
    ctor: new (config: NotificationConfig[T]) => Notification
  ) {
    this.registry.set(type, ctor)
  }

  static create<T extends NotificationType>(
    type: T,
    config: NotificationConfig[T]
  ): Notification {
    const Ctor = this.registry.get(type)
    if (!Ctor) throw new Error(\`Unknown type: \${type}\`)
    return new Ctor(config)
  }
}

// Регистрация
NotificationFactory.register('email', EmailNotification)
NotificationFactory.register('sms', SMSNotification)
NotificationFactory.register('push', PushNotification)

// Использование
const email = NotificationFactory.create('email', { to: 'user@example.com' })
const sms = NotificationFactory.create('sms', { phone: '+1234567890' })

email.send('Hello!')
sms.send('Hello!')`,
    language: 'ts',
    level: 'intermediate',
    tags: ['typescript', 'patterns', 'factory', 'registry'],
    whyRelevant2026: 'Factory pattern с generics обеспечивает type-safety',
    related: ['ts-builder-pattern', 'ts-strategy-pattern']
  },
  {
    id: 'ts-strategy-pattern',
    title: 'Strategy Pattern',
    description: 'Паттерн стратегия с типизацией',
    code: `// Интерфейс стратегии
interface PaymentStrategy {
  pay(amount: number): Promise<PaymentResult>
  validate(): boolean
}

interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

// Конкретные стратегии
class CreditCardPayment implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cvv: string,
    private expiry: string
  ) {}

  validate(): boolean {
    return this.cardNumber.length === 16 && this.cvv.length === 3
  }

  async pay(amount: number): Promise<PaymentResult> {
    if (!this.validate()) {
      return { success: false, error: 'Invalid card data' }
    }
    // Имитация API вызова
    return { success: true, transactionId: 'cc_' + Date.now() }
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  validate(): boolean {
    return this.email.includes('@')
  }

  async pay(amount: number): Promise<PaymentResult> {
    if (!this.validate()) {
      return { success: false, error: 'Invalid email' }
    }
    return { success: true, transactionId: 'pp_' + Date.now() }
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  validate(): boolean {
    return this.walletAddress.startsWith('0x')
  }

  async pay(amount: number): Promise<PaymentResult> {
    return { success: true, transactionId: 'crypto_' + Date.now() }
  }
}

// Контекст
class PaymentProcessor {
  private strategy: PaymentStrategy | null = null

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy
  }

  async processPayment(amount: number): Promise<PaymentResult> {
    if (!this.strategy) {
      return { success: false, error: 'No payment method selected' }
    }
    return this.strategy.pay(amount)
  }
}

// Использование
const processor = new PaymentProcessor()

processor.setStrategy(new CreditCardPayment('1234567890123456', '123', '12/25'))
await processor.processPayment(100)

processor.setStrategy(new PayPalPayment('user@example.com'))
await processor.processPayment(50)`,
    language: 'ts',
    level: 'intermediate',
    tags: ['typescript', 'patterns', 'strategy', 'oop'],
    whyRelevant2026: 'Strategy pattern идеален для сменных алгоритмов',
    related: ['ts-factory-pattern', 'ts-observer-pattern']
  },
  {
    id: 'ts-observer-pattern',
    title: 'Observer Pattern',
    description: 'Типизированный паттерн наблюдатель',
    code: `// Типы событий
interface EventMap {
  userLogin: { userId: string; timestamp: Date }
  userLogout: { userId: string }
  purchase: { productId: string; amount: number }
  error: { code: number; message: string }
}

type EventKey = keyof EventMap

// Generic Observer
type Observer<T> = (data: T) => void

class EventEmitter {
  private listeners = new Map<EventKey, Set<Observer<any>>>()

  on<K extends EventKey>(event: K, callback: Observer<EventMap[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    // Возвращаем функцию отписки
    return () => this.off(event, callback)
  }

  off<K extends EventKey>(event: K, callback: Observer<EventMap[K]>): void {
    this.listeners.get(event)?.delete(callback)
  }

  emit<K extends EventKey>(event: K, data: EventMap[K]): void {
    this.listeners.get(event)?.forEach(callback => callback(data))
  }

  once<K extends EventKey>(event: K, callback: Observer<EventMap[K]>): void {
    const wrapper: Observer<EventMap[K]> = (data) => {
      callback(data)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }
}

// Использование
const events = new EventEmitter()

// TypeScript знает тип data
events.on('userLogin', (data) => {
  console.log(\`User \${data.userId} logged in at \${data.timestamp}\`)
})

const unsubscribe = events.on('purchase', (data) => {
  console.log(\`Purchase: \${data.productId} for $\${data.amount}\`)
})

events.once('error', (data) => {
  console.error(\`Error \${data.code}: \${data.message}\`)
})

// Emit с проверкой типов
events.emit('userLogin', { userId: '123', timestamp: new Date() })
events.emit('purchase', { productId: 'abc', amount: 99.99 })

// Отписка
unsubscribe()`,
    language: 'ts',
    level: 'intermediate',
    tags: ['typescript', 'patterns', 'observer', 'events'],
    whyRelevant2026: 'Type-safe events предотвращают ошибки в event-driven архитектуре',
    related: ['ts-strategy-pattern', 'ts-pub-sub']
  },
  {
    id: 'ts-result-pattern',
    title: 'Result Pattern',
    description: 'Обработка ошибок без exceptions',
    code: `// Result type
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

// Конструкторы
const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value })
const Err = <E>(error: E): Result<never, E> => ({ ok: false, error })

// Утилиты
function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  return result.ok ? Ok(fn(result.value)) : result
}

function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return result.ok ? fn(result.value) : result
}

function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue
}

// Типы ошибок
type ValidationError = { type: 'validation'; field: string; message: string }
type NetworkError = { type: 'network'; status: number }
type AppError = ValidationError | NetworkError

// Использование
function parseEmail(input: string): Result<string, ValidationError> {
  if (!input.includes('@')) {
    return Err({ type: 'validation', field: 'email', message: 'Invalid email' })
  }
  return Ok(input.toLowerCase())
}

async function fetchUser(id: string): Promise<Result<User, NetworkError>> {
  try {
    const res = await fetch(\`/api/users/\${id}\`)
    if (!res.ok) {
      return Err({ type: 'network', status: res.status })
    }
    return Ok(await res.json())
  } catch {
    return Err({ type: 'network', status: 0 })
  }
}

// Цепочка операций
async function createUser(email: string): Promise<Result<User, AppError>> {
  const emailResult = parseEmail(email)
  if (!emailResult.ok) return emailResult

  const userResult = await fetchUser(emailResult.value)
  return userResult
}

// Обработка результата
const result = await createUser('test@example.com')

if (result.ok) {
  console.log('User:', result.value)
} else {
  switch (result.error.type) {
    case 'validation':
      console.log('Validation error:', result.error.message)
      break
    case 'network':
      console.log('Network error:', result.error.status)
      break
  }
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'patterns', 'result', 'errors'],
    whyRelevant2026: 'Result pattern популярен в Rust и набирает популярность в TS',
    related: ['ts-option-pattern', 'ts-discriminated-unions']
  },
  {
    id: 'ts-state-machine',
    title: 'State Machine',
    description: 'Типизированный конечный автомат',
    code: `// Определение состояний и переходов
type OrderState = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

type OrderEvent =
  | { type: 'PAY' }
  | { type: 'SHIP'; trackingNumber: string }
  | { type: 'DELIVER' }
  | { type: 'CANCEL'; reason: string }

// Валидные переходы
type StateTransitions = {
  pending: 'PAY' | 'CANCEL'
  paid: 'SHIP' | 'CANCEL'
  shipped: 'DELIVER'
  delivered: never
  cancelled: never
}

// Контекст машины
interface OrderContext {
  orderId: string
  trackingNumber?: string
  cancelReason?: string
}

// State Machine
class OrderStateMachine {
  private state: OrderState = 'pending'
  private context: OrderContext

  constructor(orderId: string) {
    this.context = { orderId }
  }

  getState(): OrderState {
    return this.state
  }

  getContext(): OrderContext {
    return { ...this.context }
  }

  canTransition(event: OrderEvent['type']): boolean {
    const validEvents: Record<OrderState, OrderEvent['type'][]> = {
      pending: ['PAY', 'CANCEL'],
      paid: ['SHIP', 'CANCEL'],
      shipped: ['DELIVER'],
      delivered: [],
      cancelled: []
    }
    return validEvents[this.state].includes(event)
  }

  send(event: OrderEvent): boolean {
    if (!this.canTransition(event.type)) {
      console.warn(\`Cannot \${event.type} from \${this.state}\`)
      return false
    }

    switch (event.type) {
      case 'PAY':
        this.state = 'paid'
        break
      case 'SHIP':
        this.state = 'shipped'
        this.context.trackingNumber = event.trackingNumber
        break
      case 'DELIVER':
        this.state = 'delivered'
        break
      case 'CANCEL':
        this.state = 'cancelled'
        this.context.cancelReason = event.reason
        break
    }

    return true
  }
}

// Использование
const order = new OrderStateMachine('order-123')

order.send({ type: 'PAY' }) // pending -> paid
order.send({ type: 'SHIP', trackingNumber: 'TRACK123' }) // paid -> shipped
order.send({ type: 'CANCEL', reason: 'test' }) // false, нельзя отменить отправленный

console.log(order.getState()) // 'shipped'
console.log(order.getContext()) // { orderId: 'order-123', trackingNumber: 'TRACK123' }`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'patterns', 'state-machine', 'fsm'],
    whyRelevant2026: 'State machines обеспечивают предсказуемость сложной логики',
    related: ['ts-discriminated-unions', 'ts-observer-pattern']
  }
]

export default patterns
