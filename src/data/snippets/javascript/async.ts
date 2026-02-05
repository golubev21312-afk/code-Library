import type { Snippet } from '@/types'

export const asyncSnippets: Snippet[] = [
  {
    id: 'async-await',
    title: 'Async/Await Basics',
    description: 'Основы async/await для работы с асинхронным кодом. Синтаксический сахар над Promise.',
    code: `// async функция всегда возвращает Promise
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`)

  if (!response.ok) {
    throw new Error(\`HTTP error: \${response.status}\`)
  }

  return response.json()
}

// Использование
const user = await fetchUser('123')
console.log(user.name)

// Или с .then()
fetchUser('123').then(user => console.log(user.name))

// Обработка ошибок с try/catch
async function loadData() {
  try {
    const user = await fetchUser('123')
    const posts = await fetchPosts(user.id)
    return { user, posts }
  } catch (error) {
    console.error('Failed to load data:', error)
    throw error
  }
}

// async в arrow functions
const getData = async (): Promise<Data> => {
  const response = await fetch('/api/data')
  return response.json()
}

// async в методах класса
class UserService {
  async getUser(id: string): Promise<User> {
    return fetchUser(id)
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await fetch(\`/api/users/\${id}\`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.json()
  }
}

// IIFE для top-level await (до ES2022)
(async () => {
  const data = await loadData()
  console.log(data)
})()

// Последовательное vs параллельное выполнение
async function sequential() {
  const user = await fetchUser('1')    // Ждём
  const posts = await fetchPosts('1')  // Потом ждём
  return { user, posts }  // ~2x время
}

async function parallel() {
  const [user, posts] = await Promise.all([
    fetchUser('1'),
    fetchPosts('1'),
  ])
  return { user, posts }  // ~1x время
}`,
    language: 'ts',
    level: 'beginner',
    tags: ['async', 'await', 'promise', 'fetch'],
    preview: 'async function fetch() { await... }',
    whyRelevant2026: 'async/await — стандарт для асинхронного кода. С top-level await (ES2022) стало ещё удобнее.',
    related: ['promise-all', 'error-handling-async'],
  },
  {
    id: 'promise-all',
    title: 'Promise.all()',
    description: 'Параллельное выполнение промисов. Ждёт все или падает при первой ошибке.',
    code: `// Promise.all() — ждёт все промисы
const [user, posts, comments] = await Promise.all([
  fetchUser('1'),
  fetchPosts('1'),
  fetchComments('1'),
])

// Все запросы выполняются параллельно!
// Результат — массив в том же порядке

// Типизация
async function loadDashboard(): Promise<Dashboard> {
  const [user, notifications, stats] = await Promise.all([
    fetchUser(),           // Promise<User>
    fetchNotifications(),  // Promise<Notification[]>
    fetchStats(),          // Promise<Stats>
  ])

  return { user, notifications, stats }
}

// При ошибке — весь Promise.all отклоняется
try {
  const results = await Promise.all([
    Promise.resolve(1),
    Promise.reject(new Error('Oops')),  // ❌ Ошибка
    Promise.resolve(3),  // Не дождёмся результата
  ])
} catch (error) {
  console.error('One promise failed:', error.message)
}

// Динамический массив промисов
const userIds = ['1', '2', '3', '4', '5']

const users = await Promise.all(
  userIds.map(id => fetchUser(id))
)
// users: User[]

// С обработкой ошибок для каждого
const usersWithErrors = await Promise.all(
  userIds.map(async id => {
    try {
      return { success: true, data: await fetchUser(id) }
    } catch (error) {
      return { success: false, error, id }
    }
  })
)

// Лимит параллельности (батчинг)
async function batchFetch<T>(
  items: string[],
  fetcher: (id: string) => Promise<T>,
  batchSize = 5
): Promise<T[]> {
  const results: T[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(fetcher)
    )
    results.push(...batchResults)
  }

  return results
}

// Использование
const allUsers = await batchFetch(userIds, fetchUser, 3)`,
    language: 'ts',
    level: 'intermediate',
    tags: ['promise', 'parallel', 'async', 'performance'],
    preview: 'Promise.all([p1, p2, p3])',
    whyRelevant2026: 'Promise.all() — ключ к производительности. Параллельные запросы критичны для быстрых UI.',
    related: ['promise-allsettled', 'promise-race'],
  },
  {
    id: 'promise-allsettled',
    title: 'Promise.allSettled()',
    description: 'Ждёт завершения всех промисов, не падая при ошибках. Возвращает статус каждого.',
    code: `// Promise.allSettled() — не падает при ошибках
const results = await Promise.allSettled([
  Promise.resolve('success'),
  Promise.reject(new Error('fail')),
  Promise.resolve('another success'),
])

// results:
// [
//   { status: 'fulfilled', value: 'success' },
//   { status: 'rejected', reason: Error: fail },
//   { status: 'fulfilled', value: 'another success' }
// ]

// Обработка результатов
results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(\`#\${index}: \${result.value}\`)
  } else {
    console.error(\`#\${index} failed:\`, result.reason)
  }
})

// Типизация с type narrowing
interface SettledResult<T> {
  status: 'fulfilled' | 'rejected'
  value?: T
  reason?: unknown
}

function getSuccessful<T>(results: PromiseSettledResult<T>[]): T[] {
  return results
    .filter((r): r is PromiseFulfilledResult<T> =>
      r.status === 'fulfilled'
    )
    .map(r => r.value)
}

function getFailed<T>(results: PromiseSettledResult<T>[]): unknown[] {
  return results
    .filter((r): r is PromiseRejectedResult =>
      r.status === 'rejected'
    )
    .map(r => r.reason)
}

// Практический пример: загрузка с частичными ошибками
async function loadAllUsers(ids: string[]): Promise<{
  users: User[]
  errors: { id: string; error: unknown }[]
}> {
  const results = await Promise.allSettled(
    ids.map(async id => {
      const user = await fetchUser(id)
      return { id, user }
    })
  )

  const users: User[] = []
  const errors: { id: string; error: unknown }[] = []

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      users.push(result.value.user)
    } else {
      errors.push({ id: ids[index], error: result.reason })
    }
  })

  return { users, errors }
}

// Использование
const { users, errors } = await loadAllUsers(['1', '2', '3'])
console.log(\`Loaded \${users.length} users, \${errors.length} failed\`)

// Retry pattern с allSettled
async function fetchWithRetry<T>(
  fetchers: (() => Promise<T>)[],
  retries = 3
): Promise<T[]> {
  let remaining = fetchers.map((f, i) => ({ fetcher: f, index: i }))
  const results: T[] = []

  for (let attempt = 0; attempt < retries && remaining.length > 0; attempt++) {
    const settled = await Promise.allSettled(
      remaining.map(r => r.fetcher())
    )

    const stillFailing: typeof remaining = []

    settled.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        results[remaining[i].index] = result.value
      } else {
        stillFailing.push(remaining[i])
      }
    })

    remaining = stillFailing
  }

  return results
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['promise', 'error-handling', 'async', 'es2020'],
    preview: 'Promise.allSettled([...])',
    whyRelevant2026: 'allSettled() незаменим для graceful degradation. Позволяет UI работать даже при частичных сбоях.',
    related: ['promise-all', 'error-handling-async'],
  },
  {
    id: 'promise-race',
    title: 'Promise.race() & Promise.any()',
    description: 'race() — первый завершённый, any() — первый успешный промис.',
    code: `// Promise.race() — первый завершённый (успех или ошибка)
const winner = await Promise.race([
  fetch('/api/server1'),
  fetch('/api/server2'),
  fetch('/api/server3'),
])
// Результат самого быстрого запроса

// Таймаут с Promise.race()
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms)
  })

  return Promise.race([promise, timeout])
}

// Использование
try {
  const data = await withTimeout(fetchData(), 5000)
} catch (error) {
  if (error.message === 'Timeout') {
    console.log('Request timed out')
  }
}

// Promise.any() — первый УСПЕШНЫЙ (игнорирует ошибки)
const fastest = await Promise.any([
  fetch('/api/mirror1').then(r => r.json()),
  fetch('/api/mirror2').then(r => r.json()),
  fetch('/api/mirror3').then(r => r.json()),
])
// Первый успешный ответ (ошибки пропускаются)

// Если ВСЕ упали — AggregateError
try {
  await Promise.any([
    Promise.reject('Error 1'),
    Promise.reject('Error 2'),
  ])
} catch (error) {
  if (error instanceof AggregateError) {
    console.log('All promises rejected:')
    error.errors.forEach(e => console.log('-', e))
  }
}

// Практический пример: failover
async function fetchWithFailover<T>(urls: string[]): Promise<T> {
  return Promise.any(
    urls.map(async url => {
      const response = await fetch(url)
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`)
      return response.json()
    })
  )
}

const data = await fetchWithFailover([
  'https://primary.api.com/data',
  'https://backup1.api.com/data',
  'https://backup2.api.com/data',
])

// Комбинация: первый успешный с таймаутом
async function fetchFastest<T>(urls: string[], timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('All requests timed out')), timeoutMs)
  })

  const fetches = urls.map(async url => {
    const res = await fetch(url)
    return res.json() as Promise<T>
  })

  return Promise.race([
    Promise.any(fetches),
    timeout,
  ])
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['promise', 'race', 'timeout', 'failover', 'es2021'],
    preview: 'Promise.race(), Promise.any()',
    whyRelevant2026: 'race() для таймаутов, any() для failover. Критичны для resilient приложений.',
    related: ['promise-all', 'promise-allsettled'],
  },
  {
    id: 'async-iteration',
    title: 'Async Iteration',
    description: 'Асинхронные итераторы и for-await-of для потоковой обработки данных.',
    code: `// for-await-of для асинхронных итераторов
async function* generateNumbers(): AsyncGenerator<number> {
  for (let i = 0; i < 5; i++) {
    await sleep(100)  // Имитация async операции
    yield i
  }
}

// Использование
for await (const num of generateNumbers()) {
  console.log(num)  // 0, 1, 2, 3, 4 (с задержкой)
}

// Async generator для пагинации
async function* fetchAllPages<T>(url: string): AsyncGenerator<T[]> {
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(\`\${url}?page=\${page}\`)
    const data = await response.json()

    yield data.items

    hasMore = data.hasNextPage
    page++
  }
}

// Обработка всех страниц
for await (const items of fetchAllPages('/api/users')) {
  items.forEach(item => processItem(item))
}

// Async iterable объект
const asyncIterable = {
  async *[Symbol.asyncIterator]() {
    yield await Promise.resolve(1)
    yield await Promise.resolve(2)
    yield await Promise.resolve(3)
  }
}

for await (const value of asyncIterable) {
  console.log(value)
}

// Практический пример: чтение потока
async function* readStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      yield decoder.decode(value, { stream: true })
    }
  } finally {
    reader.releaseLock()
  }
}

// SSE (Server-Sent Events) обработка
async function* parseSSE(response: Response): AsyncGenerator<MessageEvent> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\\n\\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        yield JSON.parse(line.slice(6))
      }
    }
  }
}

// Collect async iterator to array
async function collect<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const results: T[] = []
  for await (const item of iterable) {
    results.push(item)
  }
  return results
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['async', 'iterator', 'generator', 'streaming'],
    preview: 'for await (const x of asyncGen)',
    whyRelevant2026: 'Async iteration — основа для streaming APIs, SSE, и real-time данных. Растёт с популярностью AI streaming.',
    related: ['generators', 'readable-streams'],
  },
  {
    id: 'abort-controller',
    title: 'AbortController',
    description: 'Отмена асинхронных операций через AbortController и AbortSignal.',
    code: `// AbortController для отмены fetch запросов
const controller = new AbortController()
const { signal } = controller

// Передаём signal в fetch
const fetchPromise = fetch('/api/data', { signal })
  .then(r => r.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Request was cancelled')
    } else {
      throw err
    }
  })

// Отменяем через 5 секунд
setTimeout(() => controller.abort(), 5000)

// Или по событию
button.addEventListener('click', () => controller.abort())

// Практический пример: React useEffect cleanup
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err)
        }
      })
      .finally(() => setLoading(false))

    // Cleanup — отменяем при unmount или изменении url
    return () => controller.abort()
  }, [url])

  return { data, loading }
}

// Таймаут с AbortController
async function fetchWithTimeout<T>(
  url: string,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    return response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

// AbortSignal.timeout() — ES2024
const response = await fetch('/api/data', {
  signal: AbortSignal.timeout(5000)  // Автоматический таймаут
})

// AbortSignal.any() — комбинация сигналов
const userController = new AbortController()

const response = await fetch('/api/data', {
  signal: AbortSignal.any([
    userController.signal,        // Пользователь может отменить
    AbortSignal.timeout(10000),   // Автоматический таймаут
  ])
})

// Отслеживание отмены
signal.addEventListener('abort', () => {
  console.log('Operation was aborted')
  console.log('Reason:', signal.reason)
})

// Проверка статуса
if (signal.aborted) {
  throw new Error('Already aborted')
}

// AbortSignal.throwIfAborted()
signal.throwIfAborted()  // Выбросит если уже aborted`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['abort', 'fetch', 'cancel', 'react', 'cleanup'],
    preview: 'new AbortController()',
    whyRelevant2026: 'AbortController — стандарт для отмены операций. AbortSignal.timeout() и .any() (ES2024) упрощают код.',
    related: ['fetch-api', 'react-effects'],
  },
  {
    id: 'error-handling-async',
    title: 'Async Error Handling',
    description: 'Паттерны обработки ошибок в асинхронном коде.',
    code: `// try/catch для async/await
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(\`/api/users/\${id}\`)

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`)
    }

    return await response.json()
  } catch (error) {
    // Логируем и перебрасываем
    console.error('Failed to fetch user:', error)
    throw error
  }
}

// Go-style: возврат [error, data]
type Result<T, E = Error> = [E, null] | [null, T]

async function safeAsync<T>(
  promise: Promise<T>
): Promise<Result<T>> {
  try {
    const data = await promise
    return [null, data]
  } catch (error) {
    return [error as Error, null]
  }
}

// Использование
const [error, user] = await safeAsync(fetchUser('123'))

if (error) {
  console.error('Failed:', error.message)
} else {
  console.log('User:', user.name)
}

// Result type pattern
type AsyncResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error }

async function safeFetch<T>(url: string): Promise<AsyncResult<T>> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { success: false, error: new Error(\`HTTP \${response.status}\`) }
    }
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

const result = await safeFetch<User>('/api/user')

if (result.success) {
  console.log(result.data.name)  // TypeScript знает что data есть
} else {
  console.error(result.error.message)
}

// Retry pattern
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.log(\`Attempt \${i + 1} failed, retrying in \${delay}ms...\`)
      await sleep(delay)
      delay *= 2  // Exponential backoff
    }
  }

  throw lastError!
}

// Использование
const data = await withRetry(() => fetchUser('123'), 3, 1000)

// Error boundaries для async
class AsyncOperation<T> {
  private promise: Promise<T>

  constructor(fn: () => Promise<T>) {
    this.promise = fn()
  }

  catch(handler: (error: Error) => T | Promise<T>): AsyncOperation<T> {
    this.promise = this.promise.catch(handler)
    return this
  }

  finally(handler: () => void): AsyncOperation<T> {
    this.promise = this.promise.finally(handler)
    return this
  }

  async run(): Promise<T> {
    return this.promise
  }
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['async', 'error-handling', 'patterns', 'retry'],
    preview: 'const [error, data] = await safe()',
    whyRelevant2026: 'Правильная обработка ошибок критична. Go-style pattern набирает популярность в TypeScript сообществе.',
    related: ['promise-allsettled', 'error-cause'],
  },
  {
    id: 'debounce-throttle',
    title: 'Debounce & Throttle',
    description: 'Оптимизация частых вызовов функций. Debounce — после паузы, throttle — не чаще чем.',
    code: `// Debounce — выполнить после паузы
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

// Использование: поиск при вводе
const searchInput = document.querySelector('input')!

const handleSearch = debounce((query: string) => {
  console.log('Searching for:', query)
  // fetch(\`/api/search?q=\${query}\`)
}, 300)

searchInput.addEventListener('input', (e) => {
  handleSearch((e.target as HTMLInputElement).value)
})

// Throttle — не чаще чем раз в N мс
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      fn(...args)
    }
  }
}

// Использование: scroll handler
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY)
}, 100)

window.addEventListener('scroll', handleScroll)

// Debounce с leading edge (сразу + после паузы)
function debounceLeading<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (!timeoutId) {
      fn(...args)  // Вызвать сразу
    }

    clearTimeout(timeoutId!)
    timeoutId = setTimeout(() => {
      timeoutId = null
    }, delay)
  }
}

// Async debounce
function asyncDebounce<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  let timeoutId: ReturnType<typeof setTimeout>
  let pendingPromise: Promise<any> | null = null

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, delay)
    })
  }
}

// React hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Использование в React
function SearchComponent() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      // Выполнить поиск
      search(debouncedQuery)
    }
  }, [debouncedQuery])
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['debounce', 'throttle', 'performance', 'events', 'react'],
    preview: 'debounce(fn, 300)',
    whyRelevant2026: 'Debounce/throttle — основа оптимизации UI. Критичны для поиска, scroll, resize и других частых событий.',
    related: ['event-listeners', 'react-effects'],
  },
  {
    id: 'concurrent-limit',
    title: 'Concurrent Execution Limit',
    description: 'Ограничение количества параллельных асинхронных операций.',
    code: `// Pool для ограничения параллельности
class PromisePool<T> {
  private running = 0
  private queue: (() => Promise<T>)[] = []
  private results: T[] = []

  constructor(private concurrency: number) {}

  async add(task: () => Promise<T>): Promise<void> {
    if (this.running >= this.concurrency) {
      await new Promise<void>(resolve => {
        this.queue.push(async () => {
          const result = await task()
          this.results.push(result)
          resolve()
        })
      })
    } else {
      this.running++
      try {
        const result = await task()
        this.results.push(result)
      } finally {
        this.running--
        this.runNext()
      }
    }
  }

  private runNext(): void {
    const next = this.queue.shift()
    if (next) {
      this.running++
      next().finally(() => {
        this.running--
        this.runNext()
      })
    }
  }

  getResults(): T[] {
    return this.results
  }
}

// Упрощённая версия — pLimit pattern
function pLimit(concurrency: number) {
  const queue: (() => void)[] = []
  let active = 0

  const next = () => {
    active--
    if (queue.length > 0) {
      queue.shift()!()
    }
  }

  return <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      const run = async () => {
        active++
        try {
          resolve(await fn())
        } catch (error) {
          reject(error)
        } finally {
          next()
        }
      }

      if (active < concurrency) {
        run()
      } else {
        queue.push(run)
      }
    })
  }
}

// Использование
const limit = pLimit(3)  // Максимум 3 параллельных запроса

const userIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const users = await Promise.all(
  userIds.map(id => limit(() => fetchUser(id)))
)

// Батчинг с задержкой
async function batchWithDelay<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number,
  delayMs: number
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)

    const batchResults = await Promise.all(
      batch.map(processor)
    )

    results.push(...batchResults)

    // Задержка между батчами (кроме последнего)
    if (i + batchSize < items.length) {
      await sleep(delayMs)
    }
  }

  return results
}

// Использование
const results = await batchWithDelay(
  userIds,
  fetchUser,
  3,      // 3 запроса за раз
  1000    // 1 секунда между батчами
)

// AsyncQueue с приоритетами
class PriorityAsyncQueue<T> {
  private queues: Map<number, (() => Promise<T>)[]> = new Map()
  private running = 0

  constructor(private concurrency: number) {}

  async add(task: () => Promise<T>, priority = 0): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          resolve(await task())
        } catch (error) {
          reject(error)
        }
      }

      if (!this.queues.has(priority)) {
        this.queues.set(priority, [])
      }
      this.queues.get(priority)!.push(wrappedTask)

      this.processQueue()
    })
  }

  private async processQueue(): Promise<void> {
    if (this.running >= this.concurrency) return

    // Получить задачу с наивысшим приоритетом
    const priorities = Array.from(this.queues.keys()).sort((a, b) => b - a)

    for (const priority of priorities) {
      const queue = this.queues.get(priority)!
      if (queue.length > 0) {
        this.running++
        const task = queue.shift()!
        await task()
        this.running--
        this.processQueue()
        return
      }
    }
  }
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['async', 'concurrency', 'queue', 'rate-limiting'],
    preview: 'pLimit(3)',
    whyRelevant2026: 'Rate limiting критичен для API и crawlers. Помогает избежать 429 ошибок и перегрузки серверов.',
    related: ['promise-all', 'debounce-throttle'],
  },
]
