import type { Snippet } from '@/types'

export const patternsSnippets: Snippet[] = [
  {
    id: 'suspense',
    title: 'Suspense',
    description: 'Декларативная обработка загрузки. Показывает fallback пока дети "suspended".',
    code: `// Suspense — декларативный loading state
import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncComponent />
    </Suspense>
  )
}

// Вложенные Suspense (waterfall → parallel)
function Dashboard() {
  return (
    <div className="dashboard">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>

      <div className="content">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>

        <Suspense fallback={<MainSkeleton />}>
          <MainContent />
        </Suspense>
      </div>
    </div>
  )
}

// SuspenseList — координация нескольких Suspense
import { SuspenseList } from 'react'

function Feed() {
  return (
    <SuspenseList revealOrder="forwards" tail="collapsed">
      {posts.map(post => (
        <Suspense key={post.id} fallback={<PostSkeleton />}>
          <Post id={post.id} />
        </Suspense>
      ))}
    </SuspenseList>
  )
}

// Lazy loading компонентов
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}

// Named export lazy loading
const Modal = lazy(() =>
  import('./components').then(module => ({ default: module.Modal }))
)

// Prefetch компонента
const prefetchComponent = () => import('./HeavyComponent')

function App() {
  return (
    <button
      onMouseEnter={prefetchComponent}  // Preload при hover
      onClick={() => setShowModal(true)}
    >
      Open Modal
    </button>
  )
}

// Data fetching с Suspense (React 19)
function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchUser(userId))  // Suspends до загрузки
  return <div>{user.name}</div>
}

// Skeleton loading pattern
function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded mt-2 w-3/4" />
      <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
    </div>
  )
}

function ProductList() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {productIds.map(id => (
        <Suspense key={id} fallback={<ProductCardSkeleton />}>
          <ProductCard id={id} />
        </Suspense>
      ))}
    </div>
  )
}

// useTransition + Suspense для навигации
function NavLink({ to, children }: { to: string; children: ReactNode }) {
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()

  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault()
        startTransition(() => navigate(to))
      }}
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      {children}
    </a>
  )
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['suspense', 'lazy', 'loading', 'code-splitting'],
    preview: '<Suspense fallback={<Loading />}>',
    whyRelevant2026: 'Suspense — стандарт для loading states. В React 19 работает с use() для data fetching.',
    related: ['use-hook', 'error-boundaries'],
  },
  {
    id: 'error-boundaries',
    title: 'Error Boundaries',
    description: 'Обработка ошибок рендеринга. Предотвращает крах всего приложения.',
    code: `// Error Boundary — class component (единственный способ)
class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Логирование в сервис
    console.error('Error caught:', error, errorInfo)
    logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Использование
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Routes />
    </ErrorBoundary>
  )
}

// Гранулярные error boundaries
function Dashboard() {
  return (
    <div>
      <ErrorBoundary fallback={<WidgetError />}>
        <CriticalWidget />
      </ErrorBoundary>

      <ErrorBoundary fallback={<WidgetError />}>
        <AnotherWidget />
      </ErrorBoundary>
    </div>
  )
}

// Кастомный fallback с retry
class RetryErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleRetry}>Try Again</button>
        </div>
      )
    }
    return this.props.children
  }
}

// react-error-boundary библиотека (рекомендуется)
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => logError(error, info)}
      onReset={() => {
        // Сброс состояния приложения
      }}
    >
      <MyApp />
    </ErrorBoundary>
  )
}

// useErrorBoundary hook
function MyComponent() {
  const { showBoundary } = useErrorBoundary()

  const handleClick = async () => {
    try {
      await riskyOperation()
    } catch (error) {
      showBoundary(error)  // Передать ошибку в boundary
    }
  }

  return <button onClick={handleClick}>Do Something</button>
}

// Error boundary + Suspense
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Loading />}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['error-boundary', 'error-handling', 'resilience'],
    preview: '<ErrorBoundary fallback={}>',
    whyRelevant2026: 'Error Boundaries критичны для production apps. react-error-boundary — де-факто стандарт.',
    related: ['suspense', 'error-handling-async'],
  },
  {
    id: 'compound-components',
    title: 'Compound Components',
    description: 'Паттерн для связанных компонентов с общим состоянием.',
    code: `// Compound Components — связанные компоненты
// Пример: Accordion

interface AccordionContextType {
  activeId: string | null
  setActiveId: (id: string | null) => void
}

const AccordionContext = createContext<AccordionContextType | null>(null)

function useAccordion() {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('Must be used within Accordion')
  return context
}

// Root компонент
function Accordion({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <AccordionContext.Provider value={{ activeId, setActiveId }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  )
}

// Item компонент
function AccordionItem({ id, children }: { id: string; children: ReactNode }) {
  return <div className="accordion-item" data-id={id}>{children}</div>
}

// Trigger компонент
function AccordionTrigger({ id, children }: { id: string; children: ReactNode }) {
  const { activeId, setActiveId } = useAccordion()
  const isOpen = activeId === id

  return (
    <button
      onClick={() => setActiveId(isOpen ? null : id)}
      aria-expanded={isOpen}
    >
      {children}
      <span>{isOpen ? '−' : '+'}</span>
    </button>
  )
}

// Content компонент
function AccordionContent({ id, children }: { id: string; children: ReactNode }) {
  const { activeId } = useAccordion()

  if (activeId !== id) return null

  return <div className="accordion-content">{children}</div>
}

// Присоединяем подкомпоненты
Accordion.Item = AccordionItem
Accordion.Trigger = AccordionTrigger
Accordion.Content = AccordionContent

// Использование
function FAQ() {
  return (
    <Accordion>
      <Accordion.Item id="1">
        <Accordion.Trigger id="1">What is React?</Accordion.Trigger>
        <Accordion.Content id="1">
          React is a JavaScript library...
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item id="2">
        <Accordion.Trigger id="2">What are hooks?</Accordion.Trigger>
        <Accordion.Content id="2">
          Hooks are functions that let you...
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}

// Tabs с compound components
function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.List = TabsList
Tabs.Tab = Tab
Tabs.Panel = TabPanel

// Использование
<Tabs defaultTab="tab1">
  <Tabs.List>
    <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
  <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
</Tabs>`,
    language: 'tsx',
    level: 'advanced',
    tags: ['patterns', 'compound-components', 'context', 'composition'],
    preview: '<Accordion><Accordion.Item>',
    whyRelevant2026: 'Compound components — основа всех UI библиотек (Radix, Headless UI). Гибкость без prop drilling.',
    related: ['render-props', 'context-patterns'],
  },
  {
    id: 'render-props',
    title: 'Render Props',
    description: 'Паттерн для переиспользования логики через функцию как prop.',
    code: `// Render Props — функция как children или prop
interface MousePosition {
  x: number
  y: number
}

interface MouseTrackerProps {
  children: (position: MousePosition) => ReactNode
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return <>{children(position)}</>
}

// Использование
function App() {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    </MouseTracker>
  )
}

// Render prop через prop (не children)
interface FetchProps<T> {
  url: string
  render: (data: T | null, loading: boolean, error: Error | null) => ReactNode
}

function Fetch<T>({ url, render }: FetchProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return <>{render(data, loading, error)}</>
}

// Использование
<Fetch<User>
  url="/api/user"
  render={(user, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <Error message={error.message} />
    return <UserProfile user={user!} />
  }}
/>

// Toggle с render props
interface ToggleProps {
  children: (props: {
    on: boolean
    toggle: () => void
    setOn: () => void
    setOff: () => void
  }) => ReactNode
}

function Toggle({ children }: ToggleProps) {
  const [on, setOn] = useState(false)

  return (
    <>
      {children({
        on,
        toggle: () => setOn(o => !o),
        setOn: () => setOn(true),
        setOff: () => setOn(false),
      })}
    </>
  )
}

// Использование
<Toggle>
  {({ on, toggle }) => (
    <div>
      <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
      {on && <div>Content is visible!</div>}
    </div>
  )}
</Toggle>

// Современная альтернатива — custom hooks
// Render props vs hooks:
// - Hooks: проще, меньше вложенности
// - Render props: работают в JSX, условный рендеринг

// Hook версия
function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  return {
    on,
    toggle: () => setOn(o => !o),
    setOn: () => setOn(true),
    setOff: () => setOn(false),
  }
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['patterns', 'render-props', 'composition', 'reusable'],
    preview: '{(data) => <Component data={data} />}',
    whyRelevant2026: 'Render props всё ещё полезны для JSX-level composition. Hooks не всегда заменяют их полностью.',
    related: ['custom-hooks', 'compound-components'],
  },
  {
    id: 'hoc-pattern',
    title: 'Higher-Order Components',
    description: 'Функция принимающая компонент и возвращающая улучшенный компонент.',
    code: `// HOC — функция возвращающая компонент
function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & { loading?: boolean }> {
  return function WithLoadingComponent({ loading, ...props }: P & { loading?: boolean }) {
    if (loading) {
      return <Spinner />
    }
    return <WrappedComponent {...(props as P)} />
  }
}

// Использование
const UserProfileWithLoading = withLoading(UserProfile)

<UserProfileWithLoading user={user} loading={isLoading} />

// HOC для аутентификации
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  return function WithAuthComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) return <Spinner />
    if (!user) return <Navigate to="/login" />

    return <WrappedComponent {...props} />
  }
}

const ProtectedDashboard = withAuth(Dashboard)

// HOC для data fetching
function withData<P extends object, T>(
  WrappedComponent: ComponentType<P & { data: T }>,
  fetchFn: () => Promise<T>
): ComponentType<Omit<P, 'data'>> {
  return function WithDataComponent(props: Omit<P, 'data'>) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      fetchFn().then(setData).finally(() => setLoading(false))
    }, [])

    if (loading) return <Spinner />
    if (!data) return <Error />

    return <WrappedComponent {...(props as P)} data={data} />
  }
}

// Compose несколько HOC
const enhance = compose(
  withAuth,
  withLoading,
  withErrorBoundary
)

const EnhancedComponent = enhance(MyComponent)

// TypeScript: сохранение типов
function withLogger<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
): ComponentType<P> {
  const WithLogger = (props: P) => {
    useEffect(() => {
      console.log(\`\${componentName} mounted\`)
      return () => console.log(\`\${componentName} unmounted\`)
    }, [])

    return <WrappedComponent {...props} />
  }

  WithLogger.displayName = \`withLogger(\${componentName})\`
  return WithLogger
}

// ⚠️ Недостатки HOC:
// - Prop collision
// - Сложность типизации
// - Wrapper hell в DevTools
// - Не работают с hooks

// ✅ Современная альтернатива — custom hooks
// HOC версия
const EnhancedComponent = withAuth(withData(MyComponent))

// Hook версия (проще)
function MyComponent() {
  const { user } = useAuth()
  const { data } = useData()
  // ...
}`,
    language: 'tsx',
    level: 'advanced',
    tags: ['patterns', 'hoc', 'composition', 'typescript'],
    preview: 'const Enhanced = withAuth(Component)',
    whyRelevant2026: 'HOC менее популярны с приходом hooks, но всё ещё используются в legacy коде и некоторых библиотеках.',
    related: ['custom-hooks', 'render-props'],
  },
  {
    id: 'memo-component',
    title: 'React.memo',
    description: 'Мемоизация компонента. Пропускает ререндер если props не изменились.',
    code: `// React.memo — мемоизация компонента
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  // Тяжёлый рендеринг
  return <div>{/* ... */}</div>
})

// С custom comparison
const MemoizedComponent = memo(
  function MyComponent({ user, onClick }: Props) {
    return <div onClick={onClick}>{user.name}</div>
  },
  (prevProps, nextProps) => {
    // true = skip re-render
    // false = re-render
    return prevProps.user.id === nextProps.user.id
  }
)

// Когда memo эффективен:

// ✅ Тяжёлый рендеринг
const HeavyList = memo(function HeavyList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{complexRender(item)}</li>
      ))}
    </ul>
  )
})

// ✅ Часто ререндерящийся родитель
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <MemoizedChild />  {/* Не ререндерится при изменении count */}
    </div>
  )
}

// ⚠️ memo не поможет если props меняются

// ❌ Новый объект/массив каждый рендер
function Parent() {
  return <Child data={{ value: 1 }} />  // memo бесполезен!
}

// ✅ Стабильные props
function Parent() {
  const data = useMemo(() => ({ value: 1 }), [])
  return <Child data={data} />
}

// ❌ Новая функция каждый рендер
function Parent() {
  return <Child onClick={() => console.log('click')} />
}

// ✅ Мемоизированная функция
function Parent() {
  const handleClick = useCallback(() => console.log('click'), [])
  return <Child onClick={handleClick} />
}

// Паттерн: children как prop
// ❌ children — это новый ReactNode каждый рендер
function Parent() {
  return (
    <MemoizedComponent>
      <span>Text</span>  {/* Новый элемент! */}
    </MemoizedComponent>
  )
}

// ✅ Вынести children наружу
const content = <span>Text</span>
function Parent() {
  return <MemoizedComponent>{content}</MemoizedComponent>
}

// React 19: Compiler автоматически мемоизирует
// memo() часто не нужен с React Compiler

// Debug: почему компонент ререндерится
const MemoWithLog = memo(function MyComponent(props: Props) {
  // React DevTools Profiler показывает причину ререндера
  return <div>{/* ... */}</div>
})

// Альтернатива: React.PureComponent для классов
class PureClassComponent extends PureComponent<Props> {
  render() {
    return <div>{this.props.value}</div>
  }
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['memo', 'performance', 'memoization', 'optimization'],
    preview: 'const Memoized = memo(Component)',
    whyRelevant2026: 'memo важен для производительности. React 19 Compiler делает его менее необходимым, но понимание критично.',
    related: ['usememo-hook', 'usecallback-hook'],
  },
  {
    id: 'portal-pattern',
    title: 'Portals',
    description: 'Рендеринг детей в DOM узел вне родительской иерархии.',
    code: `// createPortal — рендер вне DOM дерева
import { createPortal } from 'react-dom'

function Modal({ children, isOpen }: { children: ReactNode; isOpen: boolean }) {
  if (!isOpen) return null

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.body  // Рендерим в body, не в родителе
  )
}

// Использование
function App() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="app">
      <button onClick={() => setShowModal(true)}>Open Modal</button>

      <Modal isOpen={showModal}>
        <h2>Modal Title</h2>
        <button onClick={() => setShowModal(false)}>Close</button>
      </Modal>
    </div>
  )
}

// Tooltip с portal
function Tooltip({ children, content, position }: TooltipProps) {
  const [show, setShow] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      })
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => { updatePosition(); setShow(true) }}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>

      {show && createPortal(
        <div
          className="tooltip"
          style={{ left: coords.x, top: coords.y }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}

// Portal в кастомный контейнер
function PortalContainer() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <div ref={containerRef} id="custom-portal-root" />

      {containerRef.current && createPortal(
        <div>Portal content</div>,
        containerRef.current
      )}
    </div>
  )
}

// Notification system с portal
function NotificationPortal({ notifications }: { notifications: Notification[] }) {
  return createPortal(
    <div className="notification-container">
      {notifications.map(n => (
        <div key={n.id} className={\`notification \${n.type}\`}>
          {n.message}
        </div>
      ))}
    </div>,
    document.body
  )
}

// События всплывают через React дерево, не DOM!
function Parent() {
  const handleClick = () => console.log('Parent clicked')

  return (
    <div onClick={handleClick}>
      <Modal>
        <button>Click me</button>  {/* Событие всплывёт к Parent */}
      </Modal>
    </div>
  )
}

// Portal контекст сохраняется
<ThemeContext.Provider value="dark">
  <Modal>
    {/* Контекст доступен внутри Portal! */}
    <ThemedButton />
  </Modal>
</ThemeContext.Provider>`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['portal', 'modal', 'tooltip', 'dom'],
    preview: "createPortal(children, document.body)",
    whyRelevant2026: 'Portals — стандарт для модалок, тултипов, notifications. Radix UI и другие библиотеки построены на них.',
    related: ['modal-pattern', 'context-patterns'],
  },
  {
    id: 'forwardref-pattern',
    title: 'forwardRef',
    description: 'Передача ref через компонент к дочернему DOM элементу.',
    code: `// forwardRef — пробрасывание ref
const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, ...props }, ref) {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...props} />
      </div>
    )
  }
)

// Использование
function Form() {
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <form>
      <Input ref={inputRef} label="Email" type="email" />
      <button type="button" onClick={focusInput}>Focus</button>
    </form>
  )
}

// forwardRef + useImperativeHandle
interface InputHandle {
  focus: () => void
  clear: () => void
  getValue: () => string
}

const CustomInput = forwardRef<InputHandle, InputProps>(
  function CustomInput(props, ref) {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => {
        if (inputRef.current) inputRef.current.value = ''
      },
      getValue: () => inputRef.current?.value || '',
    }))

    return <input ref={inputRef} {...props} />
  }
)

// Использование
function Form() {
  const inputRef = useRef<InputHandle>(null)

  const handleSubmit = () => {
    const value = inputRef.current?.getValue()
    console.log('Value:', value)
    inputRef.current?.clear()
  }

  return (
    <form onSubmit={handleSubmit}>
      <CustomInput ref={inputRef} />
    </form>
  )
}

// React 19: ref как prop (без forwardRef!)
// Новый способ в React 19
function Input({ ref, ...props }: { ref?: Ref<HTMLInputElement> } & InputProps) {
  return <input ref={ref} {...props} />
}

// Работает напрямую!
<Input ref={inputRef} />

// forwardRef с generic компонентом
interface SelectProps<T> {
  options: T[]
  value: T
  onChange: (value: T) => void
}

// Generic forwardRef — сложная типизация
function SelectInner<T>(
  props: SelectProps<T>,
  ref: ForwardedRef<HTMLSelectElement>
) {
  return (
    <select ref={ref} /* ... */>
      {/* ... */}
    </select>
  )
}

const Select = forwardRef(SelectInner) as <T>(
  props: SelectProps<T> & { ref?: ForwardedRef<HTMLSelectElement> }
) => ReactElement

// Callback ref pattern
const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const localRef = useRef<HTMLInputElement>(null)

    // Merge refs
    const setRef = useCallback((node: HTMLInputElement | null) => {
      localRef.current = node

      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    return <input ref={setRef} {...props} />
  }
)`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['forwardRef', 'ref', 'dom', 'imperative'],
    preview: 'forwardRef<HTMLElement, Props>()',
    whyRelevant2026: 'forwardRef нужен для UI библиотек. В React 19 ref можно передавать как обычный prop!',
    related: ['useref-hook', 'useimperativehandle-hook'],
  },
  {
    id: 'controlled-uncontrolled',
    title: 'Controlled vs Uncontrolled',
    description: 'Два подхода к управлению состоянием форм в React.',
    code: `// Controlled — React управляет значением
function ControlledInput() {
  const [value, setValue] = useState('')

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}

// Uncontrolled — DOM управляет значением
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    console.log('Value:', inputRef.current?.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="initial" />
      <button type="submit">Submit</button>
    </form>
  )
}

// Когда использовать:
// Controlled:
// - Валидация при каждом изменении
// - Форматирование ввода (телефон, валюта)
// - Условное отключение submit
// - Синхронизация нескольких полей

// Uncontrolled:
// - Простые формы
// - Интеграция с не-React кодом
// - Файловые inputs (всегда uncontrolled)
// - Производительность для больших форм

// Controlled с валидацией
function ControlledForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    // Валидация при каждом изменении
    if (value && !value.includes('@')) {
      setError('Invalid email')
    } else {
      setError('')
    }
  }

  return (
    <div>
      <input value={email} onChange={handleChange} />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

// Форматирование телефона (controlled)
function PhoneInput() {
  const [value, setValue] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '')
    const formatted = formatPhone(digits)
    setValue(formatted)
  }

  return <input value={value} onChange={handleChange} />
}

// Компонент поддерживающий оба режима
interface InputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

function FlexibleInput({ value, defaultValue, onChange }: InputProps) {
  // Определяем режим по наличию value
  const isControlled = value !== undefined

  const [internalValue, setInternalValue] = useState(defaultValue || '')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (!isControlled) {
      setInternalValue(newValue)
    }

    onChange?.(newValue)
  }

  return (
    <input
      value={isControlled ? value : internalValue}
      onChange={handleChange}
    />
  )
}

// Использование
<FlexibleInput defaultValue="uncontrolled" />
<FlexibleInput value={controlled} onChange={setControlled} />`,
    language: 'tsx',
    level: 'beginner',
    tags: ['forms', 'controlled', 'uncontrolled', 'input'],
    preview: 'value={state} vs defaultValue',
    whyRelevant2026: 'Понимание controlled/uncontrolled критично для форм. Большинство UI библиотек поддерживают оба режима.',
    related: ['useref-hook', 'form-patterns'],
  },
]
