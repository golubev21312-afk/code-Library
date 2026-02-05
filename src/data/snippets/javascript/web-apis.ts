import type { Snippet } from '@/types'

export const webApisSnippets: Snippet[] = [
  {
    id: 'fetch-api',
    title: 'Fetch API',
    description: 'Современный API для HTTP запросов. Замена XMLHttpRequest.',
    code: `// Базовый GET запрос
const response = await fetch('/api/users')
const users = await response.json()

// POST запрос с JSON
const newUser = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'Alice', email: 'alice@mail.com' }),
}).then(r => r.json())

// Проверка статуса (fetch не выбрасывает ошибку при 4xx/5xx)
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(\`HTTP error: \${response.status} \${response.statusText}\`)
  }

  return response.json()
}

// Все HTTP методы
await fetch(url, { method: 'GET' })
await fetch(url, { method: 'POST', body: JSON.stringify(data) })
await fetch(url, { method: 'PUT', body: JSON.stringify(data) })
await fetch(url, { method: 'PATCH', body: JSON.stringify(data) })
await fetch(url, { method: 'DELETE' })

// Отправка FormData
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('name', 'document.pdf')

await fetch('/api/upload', {
  method: 'POST',
  body: formData,  // Content-Type устанавливается автоматически
})

// Headers
const headers = new Headers({
  'Authorization': 'Bearer token123',
  'X-Custom-Header': 'value',
})

await fetch('/api/protected', { headers })

// Credentials (cookies)
await fetch('/api/data', {
  credentials: 'include',      // Отправлять cookies cross-origin
  // credentials: 'same-origin' // Только same-origin (default)
  // credentials: 'omit'        // Не отправлять cookies
})

// Таймаут с AbortSignal
await fetch('/api/data', {
  signal: AbortSignal.timeout(5000),
})

// Типизированный fetch wrapper
async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(\`/api\${endpoint}\`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || \`HTTP \${response.status}\`)
  }

  return response.json()
}

// Использование
const user = await api<User>('/users/123')
const created = await api<User>('/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'Bob' }),
})`,
    language: 'ts',
    level: 'beginner',
    tags: ['fetch', 'http', 'api', 'network'],
    preview: "fetch('/api/data')",
    whyRelevant2026: 'Fetch — стандартный API для HTTP. С AbortSignal.timeout() (ES2024) стало ещё удобнее.',
    related: ['abort-controller', 'async-await'],
  },
  {
    id: 'intersection-observer',
    title: 'Intersection Observer',
    description: 'API для отслеживания видимости элементов. Lazy loading, infinite scroll, analytics.',
    code: `// Intersection Observer — отслеживание видимости
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Element is visible:', entry.target)
        entry.target.classList.add('visible')
      }
    })
  },
  {
    root: null,           // viewport
    rootMargin: '0px',    // отступы
    threshold: 0.1,       // 10% видимости
  }
)

// Наблюдаем за элементами
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el)
})

// Lazy loading изображений
function lazyLoadImages() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src!
        img.classList.remove('lazy')
        observer.unobserve(img)  // Больше не наблюдаем
      }
    })
  })

  document.querySelectorAll('img.lazy').forEach(img => {
    imageObserver.observe(img)
  })
}

// Infinite scroll
function setupInfiniteScroll(
  sentinel: Element,
  loadMore: () => Promise<void>
) {
  let loading = false

  const observer = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !loading) {
      loading = true
      await loadMore()
      loading = false
    }
  }, {
    rootMargin: '100px',  // Загружаем заранее
  })

  observer.observe(sentinel)
  return () => observer.disconnect()
}

// React hook
function useIntersection(
  ref: RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, options?.threshold, options?.root, options?.rootMargin])

  return isIntersecting
}

// Использование в React
function LazyComponent() {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersection(ref, { threshold: 0.5 })

  return (
    <div ref={ref}>
      {isVisible ? <HeavyContent /> : <Placeholder />}
    </div>
  )
}

// Tracking views (analytics)
function trackElementView(element: Element, eventName: string) {
  const observer = new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      analytics.track(eventName, {
        element: element.id,
        timestamp: Date.now(),
      })
      obs.disconnect()  // Трекаем только один раз
    }
  }, { threshold: 0.5 })

  observer.observe(element)
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['intersection-observer', 'lazy-loading', 'performance', 'react'],
    preview: 'new IntersectionObserver()',
    whyRelevant2026: 'Intersection Observer — стандарт для lazy loading и infinite scroll. Заменяет scroll listeners.',
    related: ['resize-observer', 'mutation-observer'],
  },
  {
    id: 'resize-observer',
    title: 'Resize Observer',
    description: 'API для отслеживания изменения размеров элементов.',
    code: `// ResizeObserver — отслеживание размеров
const observer = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect
    console.log(\`Size: \${width}x\${height}\`)

    // entry.borderBoxSize, entry.contentBoxSize — более точные размеры
    const borderBox = entry.borderBoxSize[0]
    console.log(\`Border box: \${borderBox.inlineSize}x\${borderBox.blockSize}\`)
  })
})

observer.observe(document.querySelector('.resizable')!)

// React hook
function useElementSize<T extends HTMLElement>(): [
  RefObject<T>,
  { width: number; height: number }
] {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, size]
}

// Использование
function ResponsiveChart() {
  const [containerRef, { width, height }] = useElementSize<HTMLDivElement>()

  return (
    <div ref={containerRef} style={{ width: '100%', height: '400px' }}>
      <Chart width={width} height={height} data={data} />
    </div>
  )
}

// Responsive components
function useBreakpoint<T extends HTMLElement>(
  breakpoints: Record<string, number>
): [RefObject<T>, string] {
  const ref = useRef<T>(null)
  const [breakpoint, setBreakpoint] = useState('default')

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      let current = 'default'

      for (const [name, minWidth] of Object.entries(breakpoints)) {
        if (width >= minWidth) current = name
      }

      setBreakpoint(current)
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [breakpoints])

  return [ref, breakpoint]
}

// Использование
function AdaptiveGrid() {
  const [ref, breakpoint] = useBreakpoint<HTMLDivElement>({
    sm: 0,
    md: 600,
    lg: 900,
    xl: 1200,
  })

  const columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  }[breakpoint] ?? 1

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: \`repeat(\${columns}, 1fr)\` }}>
      {items.map(item => <Card key={item.id} {...item} />)}
    </div>
  )
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['resize-observer', 'responsive', 'react', 'hooks'],
    preview: 'new ResizeObserver()',
    whyRelevant2026: 'ResizeObserver — must-have для responsive компонентов и charts. Container queries в CSS не всегда достаточно.',
    related: ['intersection-observer', 'mutation-observer'],
  },
  {
    id: 'local-storage',
    title: 'Web Storage API',
    description: 'localStorage и sessionStorage для хранения данных в браузере.',
    code: `// localStorage — данные сохраняются между сессиями
localStorage.setItem('user', JSON.stringify({ name: 'Alice' }))
const user = JSON.parse(localStorage.getItem('user') || 'null')
localStorage.removeItem('user')
localStorage.clear()  // Очистить всё

// sessionStorage — данные до закрытия вкладки
sessionStorage.setItem('tempData', 'value')

// Type-safe wrapper
class Storage<T extends Record<string, unknown>> {
  constructor(
    private storage: globalThis.Storage,
    private prefix: string = ''
  ) {}

  private key(k: keyof T): string {
    return this.prefix + String(k)
  }

  get<K extends keyof T>(key: K): T[K] | null {
    const value = this.storage.getItem(this.key(key))
    if (value === null) return null
    try {
      return JSON.parse(value)
    } catch {
      return value as T[K]
    }
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.storage.setItem(this.key(key), JSON.stringify(value))
  }

  remove(key: keyof T): void {
    this.storage.removeItem(this.key(key))
  }

  clear(): void {
    // Очищаем только свои ключи
    Object.keys(this.storage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => this.storage.removeItem(k))
  }
}

// Использование
interface AppStorage {
  user: { id: string; name: string } | null
  theme: 'light' | 'dark'
  recentSearches: string[]
}

const storage = new Storage<AppStorage>(localStorage, 'app_')

storage.set('theme', 'dark')
storage.set('user', { id: '1', name: 'Alice' })

const theme = storage.get('theme')  // 'light' | 'dark' | null
const user = storage.get('user')    // { id: string; name: string } | null

// React hook с синхронизацией между вкладками
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  // Синхронизация между вкладками
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [storedValue, setValue]
}

// Использование
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  )
}`,
    language: 'tsx',
    level: 'beginner',
    tags: ['storage', 'localStorage', 'react', 'hooks', 'persistence'],
    preview: "localStorage.setItem('key', value)",
    whyRelevant2026: 'Web Storage — основа для offline-first приложений. Storage event позволяет синхронизировать вкладки.',
    related: ['indexeddb', 'cookies'],
  },
  {
    id: 'clipboard-api',
    title: 'Clipboard API',
    description: 'Современный API для работы с буфером обмена.',
    code: `// Запись текста в буфер
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

// Чтение текста из буфера
async function pasteText(): Promise<string | null> {
  try {
    return await navigator.clipboard.readText()
  } catch (error) {
    console.error('Failed to paste:', error)
    return null
  }
}

// Копирование с fallback для старых браузеров
async function copyWithFallback(text: string): Promise<boolean> {
  // Современный API
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {}
  }

  // Fallback: execCommand
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch {
    return false
  }
}

// Копирование HTML/Rich text
async function copyRichText(html: string, plainText: string) {
  const blob = new Blob([html], { type: 'text/html' })
  const textBlob = new Blob([plainText], { type: 'text/plain' })

  await navigator.clipboard.write([
    new ClipboardItem({
      'text/html': blob,
      'text/plain': textBlob,
    }),
  ])
}

// Копирование изображения
async function copyImage(imageBlob: Blob) {
  await navigator.clipboard.write([
    new ClipboardItem({
      [imageBlob.type]: imageBlob,
    }),
  ])
}

// React hook для копирования
function useCopyToClipboard(): [
  boolean,
  (text: string) => Promise<void>
] {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    const success = await copyWithFallback(text)
    setCopied(success)

    if (success) {
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return [copied, copy]
}

// Использование
function CopyButton({ text }: { text: string }) {
  const [copied, copy] = useCopyToClipboard()

  return (
    <button onClick={() => copy(text)}>
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  )
}

// Обработка вставки
document.addEventListener('paste', async (e) => {
  e.preventDefault()

  // Текст
  const text = e.clipboardData?.getData('text/plain')

  // Файлы (изображения)
  const files = Array.from(e.clipboardData?.files || [])
  const images = files.filter(f => f.type.startsWith('image/'))

  if (images.length > 0) {
    // Обработка вставленных изображений
    const imageUrl = URL.createObjectURL(images[0])
    console.log('Pasted image:', imageUrl)
  }
})`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['clipboard', 'copy', 'paste', 'react'],
    preview: 'navigator.clipboard.writeText()',
    whyRelevant2026: 'Clipboard API — стандарт для copy/paste. Поддерживает текст, HTML, изображения.',
    related: ['drag-drop', 'file-api'],
  },
  {
    id: 'geolocation-api',
    title: 'Geolocation API',
    description: 'API для получения географического положения пользователя.',
    code: `// Получение текущей позиции
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords
    console.log(\`Location: \${latitude}, \${longitude} (±\${accuracy}m)\`)
  },
  (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied geolocation')
        break
      case error.POSITION_UNAVAILABLE:
        console.error('Position unavailable')
        break
      case error.TIMEOUT:
        console.error('Timeout')
        break
    }
  },
  {
    enableHighAccuracy: true,  // GPS если доступен
    timeout: 10000,            // Максимальное время ожидания
    maximumAge: 60000,         // Кэширование позиции
  }
)

// Promise wrapper
function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

// Использование
const position = await getCurrentPosition({ enableHighAccuracy: true })
console.log(position.coords.latitude, position.coords.longitude)

// Отслеживание позиции (для навигации)
const watchId = navigator.geolocation.watchPosition(
  (position) => {
    updateMarkerOnMap(position.coords)
  },
  (error) => console.error(error),
  { enableHighAccuracy: true }
)

// Остановить отслеживание
navigator.geolocation.clearWatch(watchId)

// React hook
function useGeolocation(options?: PositionOptions) {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<GeolocationPositionError | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition(pos)
        setError(null)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
      options
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return { position, error, loading }
}

// Использование
function LocationDisplay() {
  const { position, error, loading } = useGeolocation()

  if (loading) return <div>Getting location...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      Lat: {position?.coords.latitude}
      Lng: {position?.coords.longitude}
    </div>
  )
}

// Расчёт расстояния между точками (формула гаверсинусов)
function getDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371  // Радиус Земли в км
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['geolocation', 'location', 'gps', 'react', 'maps'],
    preview: 'navigator.geolocation.getCurrentPosition()',
    whyRelevant2026: 'Geolocation API — основа для location-based сервисов. С watchPosition() можно строить трекеры.',
    related: ['permissions-api', 'web-workers'],
  },
  {
    id: 'notifications-api',
    title: 'Notifications API',
    description: 'API для показа системных уведомлений.',
    code: `// Запрос разрешения
const permission = await Notification.requestPermission()
// 'granted' | 'denied' | 'default'

// Показ уведомления
if (Notification.permission === 'granted') {
  new Notification('Hello!', {
    body: 'This is a notification',
    icon: '/icon.png',
    badge: '/badge.png',
    tag: 'unique-id',  // Заменит предыдущее с таким же tag
    requireInteraction: true,  // Не закрывать автоматически
    silent: false,     // Звук
    data: { url: '/page' },  // Данные для обработки клика
  })
}

// Обработка событий
function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission !== 'granted') {
    console.warn('Notifications not permitted')
    return null
  }

  const notification = new Notification(title, options)

  notification.onclick = (event) => {
    event.preventDefault()
    window.focus()
    notification.close()

    // Переход по URL из data
    const url = (notification as any).data?.url
    if (url) window.location.href = url
  }

  notification.onclose = () => {
    console.log('Notification closed')
  }

  notification.onerror = (error) => {
    console.error('Notification error:', error)
  }

  return notification
}

// React hook
function useNotifications() {
  const [permission, setPermission] = useState(Notification.permission)

  const requestPermission = async () => {
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const notify = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      console.warn('Permission not granted')
      return
    }
    return new Notification(title, options)
  }

  return { permission, requestPermission, notify }
}

// Использование
function NotificationButton() {
  const { permission, requestPermission, notify } = useNotifications()

  const handleClick = async () => {
    if (permission !== 'granted') {
      await requestPermission()
    }

    notify('New message!', {
      body: 'You have a new message from Alice',
      icon: '/avatar.png',
    })
  }

  return (
    <button onClick={handleClick}>
      {permission === 'granted' ? 'Send Notification' : 'Enable Notifications'}
    </button>
  )
}

// Service Worker notifications (работают в фоне)
// sw.js
self.registration.showNotification('Background Notification', {
  body: 'This works even when the page is closed',
  icon: '/icon.png',
  actions: [
    { action: 'view', title: 'View' },
    { action: 'dismiss', title: 'Dismiss' },
  ],
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    clients.openWindow('/messages')
  }
})`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['notifications', 'push', 'react', 'pwa'],
    preview: "new Notification('Title')",
    whyRelevant2026: 'Notifications — ключ к engagement. С Service Workers работают даже при закрытой вкладке.',
    related: ['service-workers', 'permissions-api'],
  },
  {
    id: 'web-workers',
    title: 'Web Workers',
    description: 'Выполнение JavaScript в отдельном потоке. Для тяжёлых вычислений.',
    code: `// Создание воркера
// worker.ts
self.onmessage = (event: MessageEvent) => {
  const { data } = event

  // Тяжёлые вычисления
  const result = heavyComputation(data)

  // Отправка результата
  self.postMessage(result)
}

function heavyComputation(data: number[]): number {
  return data.reduce((sum, n) => sum + Math.sqrt(n), 0)
}

// main.ts — использование воркера
const worker = new Worker(
  new URL('./worker.ts', import.meta.url),
  { type: 'module' }
)

worker.onmessage = (event) => {
  console.log('Result:', event.data)
}

worker.onerror = (error) => {
  console.error('Worker error:', error)
}

// Отправка данных в воркер
worker.postMessage([1, 2, 3, 4, 5])

// Promise wrapper
function runInWorker<T, R>(
  workerUrl: URL,
  data: T
): Promise<R> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerUrl, { type: 'module' })

    worker.onmessage = (e) => {
      resolve(e.data)
      worker.terminate()
    }

    worker.onerror = (e) => {
      reject(e)
      worker.terminate()
    }

    worker.postMessage(data)
  })
}

// React hook для воркера
function useWorker<T, R>(workerFactory: () => Worker) {
  const workerRef = useRef<Worker | null>(null)
  const [result, setResult] = useState<R | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    workerRef.current = workerFactory()

    workerRef.current.onmessage = (e) => {
      setResult(e.data)
      setLoading(false)
    }

    workerRef.current.onerror = (e) => {
      setError(new Error(e.message))
      setLoading(false)
    }

    return () => workerRef.current?.terminate()
  }, [])

  const run = useCallback((data: T) => {
    setLoading(true)
    setError(null)
    workerRef.current?.postMessage(data)
  }, [])

  return { result, loading, error, run }
}

// Использование
function HeavyComputation() {
  const { result, loading, run } = useWorker<number[], number>(
    () => new Worker(new URL('./worker.ts', import.meta.url))
  )

  return (
    <div>
      <button onClick={() => run([1, 2, 3, 4, 5])} disabled={loading}>
        {loading ? 'Computing...' : 'Compute'}
      </button>
      {result && <p>Result: {result}</p>}
    </div>
  )
}

// Transferable objects (для больших данных)
const buffer = new ArrayBuffer(1024 * 1024)  // 1MB
worker.postMessage(buffer, [buffer])  // Transfer, не копирование
// buffer.byteLength === 0 после transfer`,
    language: 'tsx',
    level: 'advanced',
    tags: ['workers', 'threads', 'performance', 'react'],
    preview: 'new Worker(url)',
    whyRelevant2026: 'Web Workers критичны для не-блокирующих вычислений. С Vite легко создавать и использовать.',
    related: ['shared-workers', 'service-workers'],
  },
  {
    id: 'broadcast-channel',
    title: 'Broadcast Channel',
    description: 'Коммуникация между вкладками/окнами одного origin.',
    code: `// BroadcastChannel — общение между вкладками
const channel = new BroadcastChannel('my-app')

// Отправка сообщения во все вкладки
channel.postMessage({
  type: 'USER_LOGGED_IN',
  payload: { userId: '123', name: 'Alice' },
})

// Получение сообщений
channel.onmessage = (event) => {
  const { type, payload } = event.data

  switch (type) {
    case 'USER_LOGGED_IN':
      console.log('User logged in:', payload)
      break
    case 'USER_LOGGED_OUT':
      // Выйти во всех вкладках
      window.location.href = '/login'
      break
    case 'THEME_CHANGED':
      document.documentElement.classList.toggle('dark', payload.dark)
      break
  }
}

// Закрытие канала
channel.close()

// React hook для синхронизации состояния между вкладками
function useBroadcastState<T>(
  channelName: string,
  initialValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initialValue)
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    channelRef.current = new BroadcastChannel(channelName)

    channelRef.current.onmessage = (event) => {
      setState(event.data)
    }

    return () => channelRef.current?.close()
  }, [channelName])

  const broadcast = useCallback((value: T) => {
    setState(value)
    channelRef.current?.postMessage(value)
  }, [])

  return [state, broadcast]
}

// Использование: синхронизация корзины
function Cart() {
  const [cart, setCart] = useBroadcastState<CartItem[]>('cart', [])

  const addItem = (item: CartItem) => {
    setCart([...cart, item])  // Обновится во всех вкладках
  }

  return (
    <div>
      Cart items: {cart.length}
      {/* ... */}
    </div>
  )
}

// Синхронизация auth state
function useAuthSync() {
  const channel = useRef(new BroadcastChannel('auth'))

  useEffect(() => {
    channel.current.onmessage = (event) => {
      if (event.data.type === 'LOGOUT') {
        // Выйти во всех вкладках
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }

    return () => channel.current.close()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    channel.current.postMessage({ type: 'LOGOUT' })
    window.location.href = '/login'
  }

  return { logout }
}

// Leader election (одна вкладка = лидер)
function useLeaderElection(channelName: string) {
  const [isLeader, setIsLeader] = useState(false)
  const id = useRef(Math.random().toString(36))

  useEffect(() => {
    const channel = new BroadcastChannel(channelName)
    let leaderTimeout: number

    const claimLeadership = () => {
      channel.postMessage({ type: 'CLAIM', id: id.current })
      leaderTimeout = window.setTimeout(() => setIsLeader(true), 100)
    }

    channel.onmessage = (event) => {
      if (event.data.type === 'CLAIM' && event.data.id !== id.current) {
        clearTimeout(leaderTimeout)
        setIsLeader(false)
      }
    }

    claimLeadership()

    return () => {
      clearTimeout(leaderTimeout)
      channel.close()
    }
  }, [channelName])

  return isLeader
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['broadcast', 'tabs', 'sync', 'react', 'state'],
    preview: "new BroadcastChannel('name')",
    whyRelevant2026: 'BroadcastChannel — простой способ синхронизации между вкладками. Идеален для auth, корзины, настроек.',
    related: ['local-storage', 'shared-workers'],
  },
  {
    id: 'url-api',
    title: 'URL & URLSearchParams',
    description: 'Современный API для работы с URL и query параметрами.',
    code: `// URL — парсинг и построение URL
const url = new URL('https://example.com/path?foo=bar#section')

url.protocol  // 'https:'
url.hostname  // 'example.com'
url.pathname  // '/path'
url.search    // '?foo=bar'
url.hash      // '#section'
url.href      // полный URL

// Изменение URL
url.pathname = '/new-path'
url.hash = 'new-section'
console.log(url.href)  // 'https://example.com/new-path?foo=bar#new-section'

// URLSearchParams — работа с query string
const params = new URLSearchParams('foo=bar&baz=qux')

params.get('foo')       // 'bar'
params.has('foo')       // true
params.getAll('foo')    // ['bar']
params.set('foo', 'new')
params.append('arr', '1')
params.append('arr', '2')
params.delete('baz')

params.toString()  // 'foo=new&arr=1&arr=2'

// Итерация
for (const [key, value] of params) {
  console.log(\`\${key}: \${value}\`)
}

// Из объекта
const paramsFromObj = new URLSearchParams({
  page: '1',
  limit: '10',
  sort: 'name',
})

// React hook для URL параметров
function useSearchParams<T extends Record<string, string>>(): [
  Partial<T>,
  (params: Partial<T>) => void
] {
  const [search, setSearch] = useState(window.location.search)

  const params = useMemo(() => {
    const urlParams = new URLSearchParams(search)
    const result: Partial<T> = {}
    urlParams.forEach((value, key) => {
      (result as any)[key] = value
    })
    return result
  }, [search])

  const setParams = useCallback((newParams: Partial<T>) => {
    const urlParams = new URLSearchParams(window.location.search)

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        urlParams.delete(key)
      } else {
        urlParams.set(key, value)
      }
    })

    const newSearch = urlParams.toString()
    window.history.pushState({}, '', \`?\${newSearch}\`)
    setSearch(\`?\${newSearch}\`)
  }, [])

  return [params, setParams]
}

// Использование
function ProductList() {
  const [params, setParams] = useSearchParams<{
    page: string
    sort: string
    category: string
  }>()

  const page = parseInt(params.page || '1')
  const sort = params.sort || 'name'

  return (
    <div>
      <select
        value={sort}
        onChange={(e) => setParams({ sort: e.target.value })}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>

      <button onClick={() => setParams({ page: String(page + 1) })}>
        Next page
      </button>
    </div>
  )
}

// Построение API URL
function buildApiUrl(endpoint: string, params: Record<string, string | number | undefined>) {
  const url = new URL(endpoint, 'https://api.example.com')

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

buildApiUrl('/users', { page: 1, limit: 10, search: 'alice' })
// 'https://api.example.com/users?page=1&limit=10&search=alice'`,
    language: 'tsx',
    level: 'beginner',
    tags: ['url', 'query-params', 'routing', 'react'],
    preview: "new URLSearchParams('key=value')",
    whyRelevant2026: 'URL API — стандарт для работы с URL. Заменяет ручной парсинг и регулярки.',
    related: ['history-api', 'fetch-api'],
  },
]
