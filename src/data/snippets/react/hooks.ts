import type { Snippet } from '@/types'

export const hooksSnippets: Snippet[] = [
  {
    id: 'usestate-hook',
    title: 'useState',
    description: 'Базовый хук для локального состояния компонента. Вызывает ререндер при изменении.',
    code: `// useState — локальное состояние
const [count, setCount] = useState(0)

// Обновление значением
setCount(5)

// Обновление через функцию (для зависимости от предыдущего)
setCount(prev => prev + 1)

// Объект в состоянии
const [user, setUser] = useState({ name: '', email: '' })

// ВАЖНО: не мутировать, создавать новый объект
setUser(prev => ({ ...prev, name: 'Alice' }))

// Массив в состоянии
const [items, setItems] = useState<string[]>([])

setItems(prev => [...prev, 'new item'])          // Добавить
setItems(prev => prev.filter((_, i) => i !== 0)) // Удалить первый
setItems(prev => prev.map((item, i) =>           // Обновить
  i === 0 ? 'updated' : item
))

// Ленивая инициализация (для тяжёлых вычислений)
const [data, setData] = useState(() => {
  return expensiveComputation()  // Вызовется только при первом рендере
})

// Типизация
interface User {
  id: string
  name: string
  role: 'admin' | 'user'
}

const [user, setUser] = useState<User | null>(null)

// Паттерн: несколько связанных состояний
// ❌ Плохо — много useState
const [loading, setLoading] = useState(false)
const [error, setError] = useState<Error | null>(null)
const [data, setData] = useState<Data | null>(null)

// ✅ Лучше — одно состояние с дискриминантом
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Data }
  | { status: 'error'; error: Error }

const [state, setState] = useState<State>({ status: 'idle' })

// Использование
if (state.status === 'success') {
  console.log(state.data)  // TypeScript знает что data есть
}`,
    language: 'tsx',
    level: 'beginner',
    tags: ['hooks', 'state', 'useState', 'basics'],
    preview: 'const [state, setState] = useState()',
    whyRelevant2026: 'useState — основа React. С React 19 Compiler оптимизация ререндеров стала автоматической.',
    related: ['usereducer-hook', 'usestate-patterns'],
  },
  {
    id: 'useeffect-hook',
    title: 'useEffect',
    description: 'Хук для side effects: подписки, fetch, DOM манипуляции. Выполняется после рендера.',
    code: `// useEffect — side effects
useEffect(() => {
  console.log('Component mounted or updated')
})

// С пустым массивом — только при монтировании
useEffect(() => {
  console.log('Mounted')
  return () => console.log('Unmounted')  // Cleanup
}, [])

// С зависимостями — при их изменении
useEffect(() => {
  console.log('userId changed:', userId)
}, [userId])

// Fetch данных
useEffect(() => {
  const controller = new AbortController()

  async function fetchData() {
    try {
      const response = await fetch(\`/api/users/\${userId}\`, {
        signal: controller.signal,
      })
      const data = await response.json()
      setUser(data)
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error)
      }
    }
  }

  fetchData()

  return () => controller.abort()  // Cleanup при unmount или изменении userId
}, [userId])

// Event listeners
useEffect(() => {
  const handleResize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// Подписки
useEffect(() => {
  const subscription = eventEmitter.subscribe('event', handler)
  return () => subscription.unsubscribe()
}, [])

// Синхронизация с localStorage
useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])

// Таймеры
useEffect(() => {
  const intervalId = setInterval(() => {
    setTime(new Date())
  }, 1000)

  return () => clearInterval(intervalId)
}, [])

// ⚠️ Частые ошибки:

// ❌ Бесконечный цикл — объект в зависимостях
useEffect(() => {
  // ...
}, [{ foo: 'bar' }])  // Новый объект каждый рендер!

// ✅ Примитивы или мемоизированные значения
const config = useMemo(() => ({ foo: 'bar' }), [])
useEffect(() => {
  // ...
}, [config])

// ❌ Забыли cleanup
useEffect(() => {
  socket.connect()
  // Утечка памяти!
}, [])

// ✅ С cleanup
useEffect(() => {
  socket.connect()
  return () => socket.disconnect()
}, [])`,
    language: 'tsx',
    level: 'beginner',
    tags: ['hooks', 'effects', 'useEffect', 'lifecycle', 'cleanup'],
    preview: 'useEffect(() => { ... }, [deps])',
    whyRelevant2026: 'useEffect — ключевой хук для side effects. В React 19 есть use() для data fetching, но useEffect по-прежнему нужен.',
    related: ['uselayouteffect-hook', 'useeffect-patterns'],
  },
  {
    id: 'usememo-hook',
    title: 'useMemo',
    description: 'Мемоизация вычислений. Пересчитывает только при изменении зависимостей.',
    code: `// useMemo — мемоизация значений
const expensiveValue = useMemo(() => {
  return items.filter(item => item.active)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(item => ({ ...item, processed: true }))
}, [items])

// Без useMemo — пересчёт при каждом рендере
// const filtered = items.filter(...) // ⚠️ Каждый рендер!

// Типичные кейсы:

// 1. Тяжёлые вычисления
const sortedData = useMemo(() => {
  return [...data].sort((a, b) => {
    // Сложная сортировка
    return complexCompare(a, b)
  })
}, [data])

// 2. Референциальное равенство для дочерних компонентов
const contextValue = useMemo(() => ({
  user,
  login,
  logout,
}), [user, login, logout])

return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>

// 3. Производные данные
const stats = useMemo(() => ({
  total: items.length,
  active: items.filter(i => i.active).length,
  completed: items.filter(i => i.completed).length,
}), [items])

// 4. Стабильные объекты для зависимостей
const options = useMemo(() => ({
  page,
  limit,
  sort,
}), [page, limit, sort])

useEffect(() => {
  fetchData(options)
}, [options])

// ⚠️ Когда НЕ нужен useMemo:

// ❌ Простые операции
const doubled = useMemo(() => count * 2, [count])  // Лишний overhead
const doubled = count * 2  // ✅ Просто вычисляем

// ❌ Примитивы
const name = useMemo(() => user.name, [user.name])  // Бессмысленно
const name = user.name  // ✅

// ❌ Каждый массив/объект
const arr = useMemo(() => [1, 2, 3], [])  // Если не передаётся в зависимости

// React 19: useMemo часто не нужен благодаря компилятору
// Компилятор автоматически мемоизирует где нужно

// Сравнение с useCallback
// useMemo — мемоизирует значение
const data = useMemo(() => computeData(input), [input])

// useCallback — мемоизирует функцию
const handler = useCallback(() => doSomething(input), [input])

// useCallback — это useMemo для функций
const handler = useMemo(() => () => doSomething(input), [input])`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['hooks', 'memoization', 'useMemo', 'performance'],
    preview: 'useMemo(() => compute(), [deps])',
    whyRelevant2026: 'useMemo оптимизирует производительность. В React 19 компилятор делает многое автоматически, но useMemo всё ещё полезен.',
    related: ['usecallback-hook', 'memo-component'],
  },
  {
    id: 'usecallback-hook',
    title: 'useCallback',
    description: 'Мемоизация функций. Возвращает ту же ссылку при неизменных зависимостях.',
    code: `// useCallback — мемоизация функций
const handleClick = useCallback(() => {
  console.log('Clicked!', count)
}, [count])

// Основное применение — передача в дочерние компоненты

// Без useCallback — новая функция при каждом рендере
function Parent() {
  const [count, setCount] = useState(0)

  // ❌ Новая функция каждый рендер → Child ререндерится
  const handleClick = () => setCount(c => c + 1)

  return <Child onClick={handleClick} />
}

// С useCallback
function Parent() {
  const [count, setCount] = useState(0)

  // ✅ Та же функция → Child не ререндерится (если memo)
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return <Child onClick={handleClick} />
}

const Child = memo(({ onClick }: { onClick: () => void }) => {
  console.log('Child rendered')
  return <button onClick={onClick}>Click</button>
})

// Типичные паттерны:

// 1. Event handlers
const handleSubmit = useCallback((e: FormEvent) => {
  e.preventDefault()
  submitForm(formData)
}, [formData])

// 2. Callbacks для дочерних компонентов
const handleItemClick = useCallback((id: string) => {
  setSelectedId(id)
}, [])

// 3. Зависимости для useEffect
const fetchData = useCallback(async () => {
  const data = await api.get(\`/users/\${userId}\`)
  setUser(data)
}, [userId])

useEffect(() => {
  fetchData()
}, [fetchData])

// ⚠️ Когда НЕ нужен useCallback:

// ❌ Функция не передаётся в props или зависимости
const localHandler = useCallback(() => {
  // Только используется здесь
}, [])
// ✅ Просто обычная функция
const localHandler = () => { /* ... */ }

// ❌ Дочерний компонент не мемоизирован
const handler = useCallback(() => {}, [])
return <Child onClick={handler} />  // Бессмысленно без memo

// React 19: useCallback часто не нужен
// Компилятор автоматически оптимизирует функции

// Паттерн: useCallback с параметрами
const handleDelete = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id))
}, [])

// Использование
items.map(item => (
  <Item key={item.id} onDelete={() => handleDelete(item.id)} />
))`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['hooks', 'memoization', 'useCallback', 'performance'],
    preview: 'useCallback(() => {}, [deps])',
    whyRelevant2026: 'useCallback важен для оптимизации. React 19 Compiler снижает необходимость, но понимание концепции критично.',
    related: ['usememo-hook', 'memo-component'],
  },
  {
    id: 'useref-hook',
    title: 'useRef',
    description: 'Ссылка на DOM элемент или мутабельное значение между рендерами без вызова ререндера.',
    code: `// useRef для DOM элементов
const inputRef = useRef<HTMLInputElement>(null)

const focusInput = () => {
  inputRef.current?.focus()
}

return <input ref={inputRef} />

// useRef для мутабельных значений (не вызывает ререндер)
const countRef = useRef(0)

const increment = () => {
  countRef.current += 1  // Не вызывает ререндер!
  console.log(countRef.current)
}

// Типичные кейсы:

// 1. Доступ к DOM
const videoRef = useRef<HTMLVideoElement>(null)

const playVideo = () => {
  videoRef.current?.play()
}

// 2. Сохранение предыдущего значения
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

const prevCount = usePrevious(count)

// 3. Хранение timer/interval ID
const intervalRef = useRef<number>()

useEffect(() => {
  intervalRef.current = window.setInterval(() => {
    // ...
  }, 1000)

  return () => clearInterval(intervalRef.current)
}, [])

const stop = () => clearInterval(intervalRef.current)

// 4. Флаг монтирования
const isMountedRef = useRef(false)

useEffect(() => {
  isMountedRef.current = true
  return () => { isMountedRef.current = false }
}, [])

const safeSetState = (value: T) => {
  if (isMountedRef.current) {
    setState(value)
  }
}

// 5. Callback ref для динамических элементов
const setRef = useCallback((node: HTMLDivElement | null) => {
  if (node) {
    // DOM элемент доступен
    node.scrollIntoView()
  }
}, [])

return <div ref={setRef}>Content</div>

// 6. Хранение stable callback
const callbackRef = useRef(callback)
callbackRef.current = callback  // Обновляем каждый рендер

useEffect(() => {
  const handler = () => callbackRef.current()
  element.addEventListener('click', handler)
  return () => element.removeEventListener('click', handler)
}, [])  // Пустые зависимости — но callback актуальный!

// ⚠️ Важно: useRef не вызывает ререндер
const ref = useRef(0)
ref.current = 1  // UI НЕ обновится!

// Если нужен ререндер — используй useState`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['hooks', 'useRef', 'dom', 'mutable'],
    preview: 'const ref = useRef<HTMLElement>(null)',
    whyRelevant2026: 'useRef критичен для DOM и мутабельных данных. В React 19 ref более гибкие (ref callbacks).',
    related: ['useimperativehandle-hook', 'forwardref'],
  },
  {
    id: 'usereducer-hook',
    title: 'useReducer',
    description: 'Альтернатива useState для сложного состояния. Redux-подобный паттерн.',
    code: `// useReducer — Redux-style state management
interface State {
  count: number
  step: number
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET' }

const initialState: State = { count: 0, step: 1 }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step }
    case 'DECREMENT':
      return { ...state, count: state.count - state.step }
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'SET_STEP', payload: +e.target.value })}
      />
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  )
}

// Практический пример: форма
interface FormState {
  values: { name: string; email: string }
  errors: { name?: string; email?: string }
  isSubmitting: boolean
  isValid: boolean
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET' }

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      }
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      }
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true }
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false }
    // ...
  }
}

// Ленивая инициализация
function init(initialCount: number): State {
  return { count: initialCount, step: 1 }
}

const [state, dispatch] = useReducer(reducer, 10, init)
// init(10) вызовется только при первом рендере

// Когда useReducer лучше useState:
// 1. Много связанных значений
// 2. Следующее состояние зависит от предыдущего
// 3. Сложная логика обновления
// 4. Нужен dispatch для передачи вниз (стабильная ссылка)`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['hooks', 'useReducer', 'state', 'redux-pattern'],
    preview: 'const [state, dispatch] = useReducer()',
    whyRelevant2026: 'useReducer — мощная альтернатива useState. С TypeScript обеспечивает type-safe actions.',
    related: ['usestate-hook', 'usecontext-hook'],
  },
  {
    id: 'usecontext-hook',
    title: 'useContext',
    description: 'Доступ к React Context. Позволяет передавать данные без props drilling.',
    code: `// Создание контекста
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// Custom hook для безопасного использования
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Provider
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }, [])

  // Мемоизация value чтобы избежать лишних ререндеров
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Использование
function ThemedButton() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}
    >
      Toggle Theme
    </button>
  )
}

// Комбинация Context + Reducer
interface AuthState {
  user: User | null
  loading: boolean
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User }
  | { type: 'LOGOUT' }

const AuthContext = createContext<{
  state: AuthState
  dispatch: Dispatch<AuthAction>
} | null>(null)

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be within AuthProvider')
  return context
}

// Раздельные контексты для state и dispatch (оптимизация)
const AuthStateContext = createContext<AuthState | null>(null)
const AuthDispatchContext = createContext<Dispatch<AuthAction> | null>(null)

function useAuthState() {
  const state = useContext(AuthStateContext)
  if (!state) throw new Error('...')
  return state
}

function useAuthDispatch() {
  const dispatch = useContext(AuthDispatchContext)
  if (!dispatch) throw new Error('...')
  return dispatch
}

// Компоненты которым нужен только dispatch не ререндерятся при изменении state`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['hooks', 'useContext', 'context', 'state-management'],
    preview: 'const value = useContext(MyContext)',
    whyRelevant2026: 'useContext — основа для глобального состояния без библиотек. В React 19 работает с use() для async данных.',
    related: ['usereducer-hook', 'context-patterns'],
  },
  {
    id: 'custom-hooks',
    title: 'Custom Hooks',
    description: 'Создание собственных хуков для переиспользования логики между компонентами.',
    code: `// Custom hook — функция начинающаяся с use
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue] as const
}

// useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// useAsync — управление async операциями
function useAsync<T>(asyncFunction: () => Promise<T>, immediate = true) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setValue(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setValue(response)
      setStatus('success')
    } catch (err) {
      setError(err as Error)
      setStatus('error')
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) execute()
  }, [execute, immediate])

  return { execute, status, value, error }
}

// useToggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse }
}

// useMediaQuery
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    window.matchMedia(query).matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

// Использование
function Component() {
  const [name, setName] = useLocalStorage('name', '')
  const debouncedName = useDebounce(name, 500)
  const { value: isOpen, toggle } = useToggle()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { value: users, status } = useAsync(fetchUsers)

  // ...
}

// Правила custom hooks:
// 1. Имя начинается с use
// 2. Можно вызывать другие хуки
// 3. Нельзя вызывать условно
// 4. Логика переиспользуется, state — уникален для каждого компонента`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['hooks', 'custom-hooks', 'reusable', 'patterns'],
    preview: 'function useCustomHook()',
    whyRelevant2026: 'Custom hooks — главный способ переиспользования логики в React. Основа для всех hook-библиотек.',
    related: ['usestate-hook', 'useeffect-hook'],
  },
  {
    id: 'usetransition-hook',
    title: 'useTransition',
    description: 'Маркировка обновлений как non-urgent. Позволяет UI оставаться отзывчивым.',
    code: `// useTransition — non-blocking updates
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Немедленное обновление input (urgent)
    setQuery(value)

    // Отложенное обновление результатов (non-urgent)
    startTransition(() => {
      const filtered = filterItems(allItems, value)
      setResults(filtered)
    })
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />

      {isPending && <Spinner />}

      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  )
}

// Практический пример: табы с тяжёлым контентом
function TabPanel() {
  const [activeTab, setActiveTab] = useState('tab1')
  const [isPending, startTransition] = useTransition()

  const handleTabChange = (tab: string) => {
    startTransition(() => {
      setActiveTab(tab)
    })
  }

  return (
    <div>
      <div className="tabs">
        {['tab1', 'tab2', 'tab3'].map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={activeTab === tab ? 'active' : ''}
            style={{ opacity: isPending ? 0.7 : 1 }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={isPending ? 'loading' : ''}>
        {activeTab === 'tab1' && <HeavyComponent1 />}
        {activeTab === 'tab2' && <HeavyComponent2 />}
        {activeTab === 'tab3' && <HeavyComponent3 />}
      </div>
    </div>
  )
}

// Разница с useDeferredValue
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)

// useTransition — контролируем КОГДА обновление non-urgent
// useDeferredValue — значение само становится "отложенным"

// Навигация с transition (React Router)
function Link({ to, children }: { to: string; children: ReactNode }) {
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    startTransition(() => {
      navigate(to)
    })
  }

  return (
    <a href={to} onClick={handleClick} className={isPending ? 'pending' : ''}>
      {children}
    </a>
  )
}

// Когда использовать:
// 1. Фильтрация/поиск больших списков
// 2. Переключение табов с тяжёлым контентом
// 3. Навигация между страницами
// 4. Любые non-critical обновления UI`,
    language: 'tsx',
    level: 'advanced',
    tags: ['hooks', 'useTransition', 'concurrent', 'performance'],
    preview: 'const [isPending, startTransition] = useTransition()',
    whyRelevant2026: 'useTransition — ключ к отзывчивому UI. Concurrent rendering в React 18/19 делает его ещё мощнее.',
    related: ['usedeferredvalue-hook', 'suspense'],
  },
  {
    id: 'usedeferredvalue-hook',
    title: 'useDeferredValue',
    description: 'Отложенная версия значения для non-urgent обновлений.',
    code: `// useDeferredValue — "отложенная" копия значения
function SearchList({ query }: { query: string }) {
  // deferredQuery обновляется с задержкой
  const deferredQuery = useDeferredValue(query)

  // Показываем что данные устарели
  const isStale = query !== deferredQuery

  // Тяжёлый рендеринг использует deferred значение
  const results = useMemo(() =>
    filterItems(allItems, deferredQuery),
    [deferredQuery]
  )

  return (
    <div style={{ opacity: isStale ? 0.7 : 1 }}>
      {results.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}

function App() {
  const [query, setQuery] = useState('')

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <SearchList query={query} />
    </div>
  )
}

// Практический пример: график с большим количеством точек
function Chart({ data }: { data: DataPoint[] }) {
  const deferredData = useDeferredValue(data)
  const isStale = data !== deferredData

  return (
    <div className={isStale ? 'loading' : ''}>
      <ExpensiveChart data={deferredData} />
    </div>
  )
}

// Разница с debounce
// debounce: задержка фиксированная, блокирует ввод
// useDeferredValue: адаптивная, ввод остаётся отзывчивым

// Пример с Suspense
function Results({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query)

  return (
    <Suspense fallback={<Skeleton />}>
      <SearchResults query={deferredQuery} />
    </Suspense>
  )
}

// С initialValue (React 19)
const deferredValue = useDeferredValue(value, initialValue)
// initialValue используется при первом рендере

// Когда использовать:
// 1. Когда не контролируешь источник обновления
// 2. Значение приходит из props
// 3. Нужна "stale" версия для визуализации загрузки

// useTransition vs useDeferredValue:
// useTransition — когда сам вызываешь setState
// useDeferredValue — когда значение приходит извне

// ❌ Избыточно
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)
// Лучше useTransition для setQuery

// ✅ Правильно
function Child({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query)  // query из props
}`,
    language: 'tsx',
    level: 'advanced',
    tags: ['hooks', 'useDeferredValue', 'concurrent', 'performance'],
    preview: 'const deferred = useDeferredValue(value)',
    whyRelevant2026: 'useDeferredValue дополняет useTransition. Вместе они обеспечивают smooth UI даже с тяжёлыми вычислениями.',
    related: ['usetransition-hook', 'suspense'],
  },
  {
    id: 'use-hook',
    title: 'use() Hook (React 19)',
    description: 'Новый хук для чтения ресурсов (Promise, Context) внутри рендера.',
    code: `// use() — новый способ работы с Promise в React 19
import { use, Suspense } from 'react'

// Чтение Promise
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)  // Suspends пока Promise не resolved

  return <div>{user.name}</div>
}

// Использование с Suspense
function App() {
  const userPromise = fetchUser('123')  // Не await!

  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  )
}

// use() vs useEffect для data fetching
// ❌ Старый способ с useEffect
function UserProfileOld({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false))
  }, [userId])

  if (loading) return <Loading />
  return <div>{user?.name}</div>
}

// ✅ Новый способ с use()
function UserProfileNew({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)
  return <div>{user.name}</div>
}

// use() с Context (альтернатива useContext)
function ThemedButton() {
  const theme = use(ThemeContext)  // Может вызываться условно!

  return <button className={theme}>{/* ... */}</button>
}

// Условный use() — невозможно с useContext!
function MaybeThemed({ useTheme }: { useTheme: boolean }) {
  let className = 'default'

  if (useTheme) {
    const theme = use(ThemeContext)  // ✅ Можно в условии!
    className = theme
  }

  return <div className={className} />
}

// Паттерн: preload данных
// В layout или странице
const dataPromise = fetchData()  // Начинаем загрузку сразу

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Content dataPromise={dataPromise} />
    </Suspense>
  )
}

function Content({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise)
  return <div>{data.title}</div>
}

// С error boundaries
function DataComponent({ promise }: { promise: Promise<Data> }) {
  const data = use(promise)  // Throws если rejected
  return <div>{data.title}</div>
}

// Error boundary поймает rejected promise
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Loading />}>
    <DataComponent promise={dataPromise} />
  </Suspense>
</ErrorBoundary>

// Важно: Promise должен быть стабильным!
// ❌ Новый Promise каждый рендер
function Bad() {
  const data = use(fetchData())  // Бесконечный цикл!
}

// ✅ Promise создаётся снаружи компонента
const dataPromise = fetchData()
function Good() {
  const data = use(dataPromise)
}`,
    language: 'tsx',
    level: 'advanced',
    tags: ['hooks', 'use', 'react19', 'suspense', 'async'],
    preview: 'const data = use(promise)',
    whyRelevant2026: 'use() — революция в data fetching React 19. Упрощает работу с async данными и Suspense.',
    related: ['suspense', 'error-boundaries'],
  },
]
