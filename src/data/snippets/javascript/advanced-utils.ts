import type { Snippet } from '@/types'

export const advancedUtilsSnippets: Snippet[] = [
  {
    id: 'debounce-throttle-advanced',
    title: 'Debounce / Throttle',
    description: 'Debounce откладывает вызов до паузы. Throttle ограничивает частоту вызовов. Основа оптимизации.',
    language: 'ts',
    level: 'intermediate',
    tags: ['function', 'performance', 'debounce', 'throttle'],
    code: `function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Использование
const debouncedSearch = debounce((q: string) => fetch(\`/search?q=\${q}\`), 300)
const throttledScroll = throttle(() => console.log('scroll'), 100)

input.addEventListener('input', e => debouncedSearch(e.target.value))
window.addEventListener('scroll', throttledScroll)`,
    whyRelevant2026: 'Фундаментальные паттерны. Scheduler API в будущем может заменить, но пока это стандарт.',
  },
  {
    id: 'deep-clone',
    title: 'Deep Clone',
    description: 'Глубокое копирование объекта. structuredClone — современный способ, JSON — fallback.',
    language: 'ts',
    level: 'intermediate',
    tags: ['object', 'clone', 'copy', 'deep'],
    code: `// Современный способ (ES2022+)
const clone1 = structuredClone(original)

// Работает с: Date, Map, Set, ArrayBuffer, циклическими ссылками
// НЕ работает с: функциями, DOM, Symbol, Error

// JSON способ (простые объекты)
const clone2 = JSON.parse(JSON.stringify(original))
// Теряет: Date → string, undefined, функции, Symbol

// Рекурсивный clone с поддержкой всего
function deepClone<T>(obj: T, seen = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (seen.has(obj)) return seen.get(obj)

  if (obj instanceof Date) return new Date(obj) as T
  if (obj instanceof Map) {
    const map = new Map()
    seen.set(obj, map)
    obj.forEach((v, k) => map.set(deepClone(k, seen), deepClone(v, seen)))
    return map as T
  }
  if (obj instanceof Set) {
    const set = new Set()
    seen.set(obj, set)
    obj.forEach(v => set.add(deepClone(v, seen)))
    return set as T
  }
  if (Array.isArray(obj)) {
    const arr: any[] = []
    seen.set(obj, arr)
    obj.forEach((v, i) => (arr[i] = deepClone(v, seen)))
    return arr as T
  }

  const clone = Object.create(Object.getPrototypeOf(obj))
  seen.set(obj, clone)
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone((obj as any)[key], seen)
  }
  return clone
}`,
    whyRelevant2026: 'structuredClone встроен в браузеры и Node.js. Используй его по умолчанию.',
  },
  {
    id: 'flatten-array',
    title: 'Flatten Array',
    description: 'Преобразование вложенного массива в плоский. Встроенный flat() и рекурсивная реализация.',
    language: 'ts',
    level: 'beginner',
    tags: ['array', 'flatten', 'recursive', 'utility'],
    code: `// Встроенный метод (ES2019+)
const nested = [1, [2, [3, [4]]]]

nested.flat()      // [1, 2, [3, [4]]] - глубина 1
nested.flat(2)     // [1, 2, 3, [4]] - глубина 2
nested.flat(Infinity) // [1, 2, 3, 4] - полностью плоский

// Рекурсивная реализация с типизацией
type Flatten<T> = T extends (infer U)[] ? Flatten<U> : T

function flatten<T>(arr: T[], depth = Infinity): Flatten<T>[] {
  return arr.reduce<Flatten<T>[]>((acc, val) => {
    if (Array.isArray(val) && depth > 0) {
      acc.push(...flatten(val, depth - 1))
    } else {
      acc.push(val as Flatten<T>)
    }
    return acc
  }, [])
}

// flatMap для одного уровня + трансформация
const users = [{ tags: ['a', 'b'] }, { tags: ['c'] }]
users.flatMap(u => u.tags) // ['a', 'b', 'c']

// Примеры
flatten([1, [2, [3]]]) // [1, 2, 3]
flatten([1, [2, [3]]], 1) // [1, 2, [3]]`,
    whyRelevant2026: 'flat() и flatMap() — стандарт ES2019. Полифилы не нужны.',
  },
  {
    id: 'generate-uuid',
    title: 'Generate UUID',
    description: 'Генерация уникального идентификатора. crypto.randomUUID() — современный способ.',
    language: 'ts',
    level: 'beginner',
    tags: ['uuid', 'id', 'random', 'crypto'],
    code: `// Современный способ (рекомендуется)
const uuid = crypto.randomUUID()
// "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

// Fallback для старых браузеров
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Короткий ID (не UUID, но уникальный)
function shortId(length = 8): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, length)
}

// Nano ID стиль
function nanoId(size = 21): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  return Array.from(bytes, b => chars[b % chars.length]).join('')
}

// Примеры
crypto.randomUUID() // "550e8400-e29b-41d4-a716-446655440000"
shortId()           // "a1b2c3d4"
nanoId()            // "V1StGXR8_Z5jdHi6B-myT"`,
    whyRelevant2026: 'crypto.randomUUID() в браузерах и Node.js. Не нужны библиотеки uuid/nanoid для базовых случаев.',
  },
  {
    id: 'format-numbers',
    title: 'Format Numbers',
    description: 'Форматирование чисел: валюта, проценты, компактный формат. Intl.NumberFormat для локализации.',
    language: 'ts',
    level: 'beginner',
    tags: ['number', 'format', 'intl', 'currency'],
    code: `// Валюта
const formatCurrency = (n: number, currency = 'RUB', locale = 'ru-RU') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n)

formatCurrency(1234.5)           // "1 234,50 ₽"
formatCurrency(1234.5, 'USD', 'en-US') // "$1,234.50"

// Проценты
const formatPercent = (n: number, locale = 'ru-RU') =>
  new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(n)

formatPercent(0.1234)  // "12,3 %"

// Компактный формат (1K, 1M)
const formatCompact = (n: number, locale = 'ru-RU') =>
  new Intl.NumberFormat(locale, { notation: 'compact' }).format(n)

formatCompact(1234)      // "1 тыс."
formatCompact(1234567)   // "1 млн"

// Разделители тысяч
const formatNumber = (n: number, locale = 'ru-RU') =>
  new Intl.NumberFormat(locale).format(n)

formatNumber(1234567.89) // "1 234 567,89"

// Единицы измерения
const formatUnit = (n: number, unit: string, locale = 'ru-RU') =>
  new Intl.NumberFormat(locale, { style: 'unit', unit }).format(n)

formatUnit(100, 'kilometer')     // "100 км"
formatUnit(5, 'kilogram')        // "5 кг"`,
    whyRelevant2026: 'Intl.NumberFormat покрывает 99% случаев. Не нужны библиотеки для форматирования.',
  },
  {
    id: 'parse-query-string',
    title: 'Parse Query String',
    description: 'Парсинг и создание query string. URLSearchParams — встроенный API.',
    language: 'ts',
    level: 'beginner',
    tags: ['url', 'query', 'params', 'parse'],
    code: `// Парсинг query string
const params = new URLSearchParams('?name=John&age=30&tags=a&tags=b')

params.get('name')      // "John"
params.get('age')       // "30"
params.getAll('tags')   // ["a", "b"]
params.has('name')      // true

// В объект
const toObject = (search: string) =>
  Object.fromEntries(new URLSearchParams(search))

toObject('?a=1&b=2') // { a: "1", b: "2" }

// С поддержкой массивов
function parseQuery(search: string): Record<string, string | string[]> {
  const params = new URLSearchParams(search)
  const result: Record<string, string | string[]> = {}

  for (const key of params.keys()) {
    const values = params.getAll(key)
    result[key] = values.length > 1 ? values : values[0]
  }
  return result
}

// Создание query string
const query = new URLSearchParams({ name: 'John', age: '30' })
query.toString() // "name=John&age=30"

// Из объекта
const toQueryString = (obj: Record<string, string | number>) =>
  new URLSearchParams(
    Object.entries(obj).map(([k, v]) => [k, String(v)])
  ).toString()

toQueryString({ page: 1, limit: 10 }) // "page=1&limit=10"`,
    whyRelevant2026: 'URLSearchParams — стандарт. Работает в браузерах и Node.js.',
  },
  {
    id: 'retry-backoff',
    title: 'Retry with Backoff',
    description: 'Повторные попытки с экспоненциальной задержкой. Для надёжных API запросов.',
    language: 'ts',
    level: 'advanced',
    tags: ['async', 'retry', 'backoff', 'fetch'],
    code: `interface RetryOptions {
  maxAttempts?: number
  baseDelay?: number
  maxDelay?: number
  shouldRetry?: (error: unknown) => boolean
}

async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    shouldRetry = () => true,
  } = options

  let lastError: unknown

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxAttempts - 1 || !shouldRetry(error)) {
        throw error
      }

      const delay = Math.min(baseDelay * 2 ** attempt, maxDelay)
      const jitter = delay * 0.1 * Math.random()
      await new Promise(r => setTimeout(r, delay + jitter))
    }
  }

  throw lastError
}

// Использование
const data = await retry(
  () => fetch('/api/data').then(r => {
    if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
    return r.json()
  }),
  {
    maxAttempts: 5,
    baseDelay: 500,
    shouldRetry: (err) => {
      // Retry только на 5xx и сетевых ошибках
      if (err instanceof Error && err.message.includes('HTTP 5')) return true
      if (err instanceof TypeError) return true // network error
      return false
    },
  }
)`,
    whyRelevant2026: 'Микросервисы и нестабильные сети требуют retry. Jitter предотвращает thundering herd.',
  },
  {
    id: 'event-emitter',
    title: 'Event Emitter',
    description: 'Паттерн pub/sub для событий. Типизированная реализация с поддержкой once.',
    language: 'ts',
    level: 'advanced',
    tags: ['events', 'pubsub', 'pattern', 'observer'],
    code: `type EventMap = Record<string, any[]>
type Listener<T extends any[]> = (...args: T) => void

class EventEmitter<Events extends EventMap> {
  private listeners = new Map<keyof Events, Set<Listener<any>>>()

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
    return () => this.off(event, listener)
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    const wrapper = (...args: Events[K]) => {
      this.off(event, wrapper)
      listener(...args)
    }
    return this.on(event, wrapper)
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    this.listeners.get(event)?.delete(listener)
  }

  emit<K extends keyof Events>(event: K, ...args: Events[K]) {
    this.listeners.get(event)?.forEach(fn => fn(...args))
  }

  clear() {
    this.listeners.clear()
  }
}

// Использование с типами
type AppEvents = {
  login: [user: { id: string; name: string }]
  logout: []
  message: [text: string, from: string]
}

const emitter = new EventEmitter<AppEvents>()

emitter.on('login', (user) => console.log(\`Hello \${user.name}\`))
emitter.once('logout', () => console.log('Goodbye'))
emitter.emit('login', { id: '1', name: 'John' })`,
    whyRelevant2026: 'EventTarget существует, но типизация слабая. Свой emitter даёт полный контроль типов.',
  },
  {
    id: 'memoize',
    title: 'Memoize',
    description: 'Кеширование результатов функции. Ускоряет повторные вызовы с теми же аргументами.',
    language: 'ts',
    level: 'intermediate',
    tags: ['function', 'cache', 'performance', 'optimization'],
    code: `function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = keyFn(...args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// С ограничением размера кеша (LRU)
function memoizeLRU<T extends (...args: any[]) => any>(
  fn: T,
  maxSize = 100
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      const value = cache.get(key)!
      cache.delete(key)
      cache.set(key, value) // Move to end
      return value
    }

    const result = fn(...args)
    cache.set(key, result)

    if (cache.size > maxSize) {
      cache.delete(cache.keys().next().value!)
    }

    return result
  }) as T
}

// Использование
const expensiveFn = memoize((n: number) => {
  console.log('Computing...')
  return n * 2
})

expensiveFn(5) // "Computing..." → 10
expensiveFn(5) // 10 (из кеша)`,
    whyRelevant2026: 'Мемоизация критична для React (useMemo) и тяжёлых вычислений. LRU предотвращает утечки памяти.',
  },
  {
    id: 'pipe-compose',
    title: 'Pipe / Compose',
    description: 'Композиция функций. Pipe — слева направо, compose — справа налево. Функциональный стиль.',
    language: 'ts',
    level: 'advanced',
    tags: ['function', 'fp', 'compose', 'pipe'],
    code: `// Pipe: слева направо (более читаемый)
function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  return (arg) => fns.reduce((acc, fn) => fn(acc), arg)
}

// Compose: справа налево (математический порядок)
function compose<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  return (arg) => fns.reduceRight((acc, fn) => fn(acc), arg)
}

// Типизированный pipe для разных типов
type PipeFn = {
  <A, B>(fn1: (a: A) => B): (a: A) => B
  <A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C
  <A, B, C, D>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D): (a: A) => D
}

const typedPipe: PipeFn = (...fns: Function[]) =>
  (arg: any) => fns.reduce((acc, fn) => fn(acc), arg)

// Использование
const addOne = (n: number) => n + 1
const double = (n: number) => n * 2
const toString = (n: number) => \`Result: \${n}\`

const process = pipe(addOne, double, toString)
process(5) // "Result: 12" (5+1=6, 6*2=12)

// Async pipe
async function asyncPipe<T>(
  value: T,
  ...fns: ((arg: T) => T | Promise<T>)[]
): Promise<T> {
  return fns.reduce<Promise<T>>(
    async (acc, fn) => fn(await acc),
    Promise.resolve(value)
  )
}

// Пример
await asyncPipe(
  'user-123',
  fetchUser,
  validateUser,
  saveToCache
)`,
    whyRelevant2026: 'Pipeline operator (|>) в Stage 2. Пока используем функции. FP популярен в React экосистеме.',
  },
]
