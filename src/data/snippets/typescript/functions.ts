import type { Snippet } from '@/types'

export const functions: Snippet[] = [
  {
    id: 'ts-function-overloads',
    title: 'Function Overloads',
    description: 'Перегрузка функций для разных типов',
    code: `// Перегрузка функции
function createElement(tag: 'a'): HTMLAnchorElement
function createElement(tag: 'canvas'): HTMLCanvasElement
function createElement(tag: 'input'): HTMLInputElement
function createElement(tag: string): HTMLElement
function createElement(tag: string): HTMLElement {
  return document.createElement(tag)
}

// TypeScript знает точный тип
const link = createElement('a') // HTMLAnchorElement
link.href = '/home' // ✅ OK

const canvas = createElement('canvas') // HTMLCanvasElement
canvas.getContext('2d') // ✅ OK

// Перегрузка с разным количеством аргументов
function padding(all: number): string
function padding(vertical: number, horizontal: number): string
function padding(top: number, right: number, bottom: number, left: number): string
function padding(...args: number[]): string {
  switch (args.length) {
    case 1: return \`\${args[0]}px\`
    case 2: return \`\${args[0]}px \${args[1]}px\`
    case 4: return \`\${args[0]}px \${args[1]}px \${args[2]}px \${args[3]}px\`
    default: throw new Error('Invalid arguments')
  }
}

padding(10) // "10px"
padding(10, 20) // "10px 20px"
padding(10, 20, 30, 40) // "10px 20px 30px 40px"
// padding(10, 20, 30) // ❌ Error

// Method overloads в классе
class DataFetcher {
  fetch(url: string): Promise<Response>
  fetch(url: string, options: RequestInit): Promise<Response>
  fetch(urls: string[]): Promise<Response[]>
  async fetch(
    urlOrUrls: string | string[],
    options?: RequestInit
  ): Promise<Response | Response[]> {
    if (Array.isArray(urlOrUrls)) {
      return Promise.all(urlOrUrls.map(url => fetch(url)))
    }
    return fetch(urlOrUrls, options)
  }
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['typescript', 'functions', 'overloads'],
    whyRelevant2026: 'Overloads обеспечивают точные типы для разных вариантов вызова',
    related: ['ts-generic-functions', 'ts-conditional-types']
  },
  {
    id: 'ts-generic-functions',
    title: 'Generic Functions',
    description: 'Обобщённые функции с ограничениями',
    code: `// Базовая generic функция
function identity<T>(value: T): T {
  return value
}

const str = identity('hello') // string
const num = identity(42) // number

// С ограничением (constraint)
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'John', age: 30 }
const name = getProperty(user, 'name') // string
const age = getProperty(user, 'age') // number
// getProperty(user, 'email') // ❌ Error

// Множественные generics
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b }
}

const merged = merge({ name: 'John' }, { age: 30 })
// { name: string; age: number }

// Default generic type
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value)
}

const strings = createArray(3, 'x') // string[]
const numbers = createArray<number>(3, 0) // number[]

// Infer в функции
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0]
}

const first = firstElement([1, 2, 3]) // number | undefined

// Generic с условным возвратом
function wrap<T>(value: T): T extends null | undefined ? null : { value: T } {
  if (value == null) return null as any
  return { value } as any
}

wrap(5) // { value: number }
wrap(null) // null

// Generic async функция
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return response.json()
}

interface User { id: string; name: string }
const userData = await fetchData<User>('/api/user') // User`,
    language: 'ts',
    level: 'intermediate',
    tags: ['typescript', 'generics', 'functions'],
    whyRelevant2026: 'Generic functions - основа type-safe библиотек',
    related: ['ts-function-overloads', 'ts-conditional-types']
  },
  {
    id: 'ts-type-predicates',
    title: 'Type Predicates',
    description: 'Пользовательские type guards',
    code: `// Type predicate функция
interface Fish { swim: () => void }
interface Bird { fly: () => void }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim() // TypeScript знает что это Fish
  } else {
    pet.fly() // TypeScript знает что это Bird
  }
}

// Для массивов с filter
interface User {
  id: string
  name: string
  email?: string
}

function hasEmail(user: User): user is User & { email: string } {
  return user.email !== undefined
}

const users: User[] = [
  { id: '1', name: 'John', email: 'john@example.com' },
  { id: '2', name: 'Jane' }
]

const usersWithEmail = users.filter(hasEmail)
// (User & { email: string })[]
usersWithEmail[0].email // ✅ string, не string | undefined

// Assertion function
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Expected string')
  }
}

function processValue(value: unknown) {
  assertIsString(value)
  // После assertion value имеет тип string
  console.log(value.toUpperCase())
}

// Assert non-null
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value == null) {
    throw new Error('Value is not defined')
  }
}

// Discriminated union guard
interface SuccessResponse { status: 'success'; data: unknown }
interface ErrorResponse { status: 'error'; error: string }
type Response = SuccessResponse | ErrorResponse

function isSuccess(response: Response): response is SuccessResponse {
  return response.status === 'success'
}

async function handleResponse(response: Response) {
  if (isSuccess(response)) {
    console.log(response.data) // ✅ SuccessResponse
  } else {
    console.log(response.error) // ✅ ErrorResponse
  }
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'type-guards', 'predicates', 'narrowing'],
    whyRelevant2026: 'Type predicates обеспечивают безопасное сужение типов',
    related: ['ts-discriminated-unions', 'ts-generic-functions']
  },
  {
    id: 'ts-higher-order-functions',
    title: 'Higher-Order Functions',
    description: 'Функции высшего порядка с типизацией',
    code: `// Типизированный compose
type Func<T, R> = (arg: T) => R

function compose<A, B, C>(
  f: Func<B, C>,
  g: Func<A, B>
): Func<A, C> {
  return (x: A) => f(g(x))
}

const addOne = (x: number) => x + 1
const double = (x: number) => x * 2
const addOneThenDouble = compose(double, addOne)
console.log(addOneThenDouble(5)) // 12

// Pipe с variadic types
type LastOf<T extends any[]> = T extends [...any[], infer L] ? L : never
type PipeResult<Fns extends Func<any, any>[]> =
  LastOf<Fns> extends Func<any, infer R> ? R : never

function pipe<T>(...fns: Func<any, any>[]): (x: T) => any {
  return (x: T) => fns.reduce((v, f) => f(v), x)
}

// Curry
function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return (a: A) => (b: B) => fn(a, b)
}

const add = (a: number, b: number) => a + b
const curriedAdd = curry(add)
const add5 = curriedAdd(5)
console.log(add5(3)) // 8

// Debounce с типами
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Throttle
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Memoize
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)!

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

const expensiveFn = memoize((n: number) => {
  console.log('Computing...')
  return n * 2
})`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'functions', 'hof', 'functional'],
    whyRelevant2026: 'HOF с типами - основа функционального программирования в TS',
    related: ['ts-generic-functions', 'ts-utility-types']
  },
  {
    id: 'ts-async-functions',
    title: 'Async Functions Typing',
    description: 'Типизация асинхронных функций',
    code: `// Базовая async функция
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

// Generic async функция
async function fetchData<T>(url: string, schema: z.ZodSchema<T>): Promise<T> {
  const response = await fetch(url)
  const data = await response.json()
  return schema.parse(data) // Runtime validation
}

// Async generator
async function* paginate<T>(
  fetchPage: (page: number) => Promise<{ data: T[]; hasNext: boolean }>
): AsyncGenerator<T, void, unknown> {
  let page = 1
  let hasNext = true

  while (hasNext) {
    const result = await fetchPage(page)
    yield* result.data
    hasNext = result.hasNext
    page++
  }
}

// Использование
for await (const user of paginate(fetchUsersPage)) {
  console.log(user)
}

// Retry wrapper
async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay: number }
): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= options.retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < options.retries) {
        await new Promise(r => setTimeout(r, options.delay))
      }
    }
  }

  throw lastError!
}

// Timeout wrapper
function withTimeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ])
}

// Concurrent execution с лимитом
async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = []
  const executing: Promise<void>[] = []

  for (const item of items) {
    const p = fn(item).then(result => {
      results.push(result)
    })

    executing.push(p)

    if (executing.length >= limit) {
      await Promise.race(executing)
      executing.splice(executing.findIndex(e => e === p), 1)
    }
  }

  await Promise.all(executing)
  return results
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'async', 'functions', 'promises'],
    whyRelevant2026: 'Правильная типизация async функций предотвращает runtime ошибки',
    related: ['ts-generic-functions', 'js-async-await']
  },
  {
    id: 'ts-this-typing',
    title: 'This Parameter Typing',
    description: 'Типизация контекста this',
    code: `// This parameter в функции
function greet(this: { name: string }, greeting: string) {
  return \`\${greeting}, \${this.name}!\`
}

const user = { name: 'John', greet }
user.greet('Hello') // "Hello, John!"

// greet('Hi') // ❌ Error: this context is void

// В callback функциях
interface ButtonHandler {
  label: string
  onClick(this: ButtonHandler): void
}

const handler: ButtonHandler = {
  label: 'Submit',
  onClick() {
    console.log(\`Clicked: \${this.label}\`) // this типизирован
  }
}

// ThisParameterType и OmitThisParameter
type GreetFn = typeof greet

type GreetThis = ThisParameterType<GreetFn> // { name: string }
type GreetWithoutThis = OmitThisParameter<GreetFn> // (greeting: string) => string

// Bind с типами
const boundGreet = greet.bind({ name: 'Alice' })
boundGreet('Hi') // "Hi, Alice!"

// This в методах класса
class Counter {
  count = 0

  // Метод с явным this
  increment(this: Counter) {
    this.count++
  }

  // Arrow function - this автоматически привязан
  decrement = () => {
    this.count--
  }

  // Fluent interface с this типом
  add(n: number): this {
    this.count += n
    return this
  }

  subtract(n: number): this {
    this.count -= n
    return this
  }
}

// Цепочка вызовов
const counter = new Counter()
counter.add(5).subtract(2).add(10)
console.log(counter.count) // 13

// This в generic классе
class Builder<T extends object> {
  protected data: T = {} as T

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value
    return this
  }

  build(): T {
    return this.data
  }
}

interface User { name: string; age: number }

const userData = new Builder<User>()
  .set('name', 'John')
  .set('age', 30)
  .build()`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'this', 'functions', 'context'],
    whyRelevant2026: 'Типизация this предотвращает ошибки контекста',
    related: ['ts-generic-functions', 'ts-class-patterns']
  }
]

export default functions
