import type { Snippet } from '@/types'

export const performance: Snippet[] = [
  {
    id: 'react-use-memo',
    title: 'useMemo оптимизация',
    description: 'Мемоизация дорогих вычислений',
    code: `import { useMemo, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

  // ✅ Мемоизация фильтрации и сортировки
  const filteredAndSorted = useMemo(() => {
    console.log('Computing filtered products...')

    return products
      .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return a.price - b.price
      })
  }, [products, filter, sortBy])

  // ✅ Мемоизация агрегаций
  const stats = useMemo(() => ({
    total: filteredAndSorted.length,
    avgPrice: filteredAndSorted.reduce((sum, p) => sum + p.price, 0) /
              filteredAndSorted.length || 0,
    categories: [...new Set(filteredAndSorted.map(p => p.category))]
  }), [filteredAndSorted])

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>

      <p>Found {stats.total} products, avg price: \${stats.avgPrice.toFixed(2)}</p>

      <ul>
        {filteredAndSorted.map(p => (
          <li key={p.id}>{p.name} - \${p.price}</li>
        ))}
      </ul>
    </div>
  )
}

// ❌ Когда НЕ использовать useMemo
function BadExample({ items }: { items: string[] }) {
  // Слишком простая операция
  const sorted = useMemo(() => [...items].sort(), [items])

  // Объект создаётся заново при каждом рендере всё равно
  const style = useMemo(() => ({ color: 'red' }), [])

  return <div style={style}>{sorted.join(', ')}</div>
}

// ✅ Лучше просто
function GoodExample({ items }: { items: string[] }) {
  const sorted = [...items].sort()
  return <div style={{ color: 'red' }}>{sorted.join(', ')}</div>
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['react', 'useMemo', 'performance', 'optimization'],
    whyRelevant2026: 'useMemo важен для дорогих вычислений, но не для всего подряд',
    related: ['react-use-callback', 'react-memo']
  },
  {
    id: 'react-use-callback',
    title: 'useCallback оптимизация',
    description: 'Стабильные ссылки на функции',
    code: `import { useCallback, useState, memo } from 'react'

// Дочерний компонент обёрнут в memo
const ExpensiveChild = memo(function ExpensiveChild({
  onClick,
  data
}: {
  onClick: (id: string) => void
  data: { id: string; name: string }
}) {
  console.log('ExpensiveChild render:', data.id)
  return (
    <button onClick={() => onClick(data.id)}>
      {data.name}
    </button>
  )
})

function Parent() {
  const [count, setCount] = useState(0)
  const [items] = useState([
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' }
  ])

  // ❌ Создаётся новая функция при каждом рендере
  // const handleClick = (id: string) => console.log('Clicked:', id)

  // ✅ Стабильная ссылка
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id)
  }, [])

  // ✅ С зависимостями
  const handleClickWithCount = useCallback((id: string) => {
    console.log('Clicked:', id, 'Count:', count)
  }, [count])

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>

      {/* Не ре-рендерятся при изменении count */}
      {items.map(item => (
        <ExpensiveChild
          key={item.id}
          data={item}
          onClick={handleClick}
        />
      ))}
    </div>
  )
}

// Паттерн: useCallback + useRef для актуального значения
function SearchComponent() {
  const [query, setQuery] = useState('')
  const queryRef = useRef(query)
  queryRef.current = query

  // Стабильная функция с доступом к актуальному query
  const search = useCallback(() => {
    console.log('Searching:', queryRef.current)
  }, [])

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <SearchButton onSearch={search} />
    </div>
  )
}

// useEvent паттерн (будет в React)
function useEvent<T extends (...args: any[]) => any>(handler: T): T {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  return useCallback((...args: Parameters<T>) => {
    return handlerRef.current(...args)
  }, []) as T
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['react', 'useCallback', 'performance', 'memo'],
    whyRelevant2026: 'useCallback нужен только с memo компонентами или в deps',
    related: ['react-use-memo', 'react-memo']
  },
  {
    id: 'react-memo',
    title: 'React.memo оптимизация',
    description: 'Предотвращение лишних ре-рендеров',
    code: `import { memo, useState } from 'react'

// Базовое использование memo
const UserCard = memo(function UserCard({
  user
}: {
  user: { id: string; name: string; avatar: string }
}) {
  console.log('UserCard render:', user.id)
  return (
    <div className="card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
    </div>
  )
})

// С кастомной функцией сравнения
interface Post {
  id: string
  title: string
  content: string
  updatedAt: Date
}

const PostCard = memo(
  function PostCard({ post }: { post: Post }) {
    console.log('PostCard render:', post.id)
    return (
      <article>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </article>
    )
  },
  // Сравниваем только id и updatedAt
  (prevProps, nextProps) => {
    return prevProps.post.id === nextProps.post.id &&
           prevProps.post.updatedAt === nextProps.post.updatedAt
  }
)

// Паттерн: выносим статические компоненты
function Dashboard() {
  const [data, setData] = useState<Data | null>(null)

  return (
    <div>
      {/* Header не зависит от data, но ре-рендерится */}
      <Header />
      <Sidebar />
      {data && <DataView data={data} />}
    </div>
  )
}

// ✅ Лучше: memo для независимых компонентов
const Header = memo(function Header() {
  console.log('Header render')
  return <header>Dashboard</header>
})

// Или: children pattern
function Dashboard({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data | null>(null)

  return (
    <div>
      {children} {/* Не ре-рендерится */}
      {data && <DataView data={data} />}
    </div>
  )
}

// Использование
;<Dashboard>
  <Header />
  <Sidebar />
</Dashboard>`,
    language: 'ts',
    level: 'intermediate',
    tags: ['react', 'memo', 'performance', 'rendering'],
    whyRelevant2026: 'memo эффективен только с стабильными props',
    related: ['react-use-callback', 'react-use-memo']
  },
  {
    id: 'react-virtualization',
    title: 'Виртуализация списков',
    description: 'Рендеринг только видимых элементов',
    code: `import { useRef, useState, useEffect, useMemo } from 'react'

// Простая виртуализация
interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
}

function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Вычисляем видимый диапазон
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const overscan = 3 // Дополнительные элементы сверху/снизу

    return {
      startIndex: Math.max(0, start - overscan),
      endIndex: Math.min(items.length - 1, start + visibleCount + overscan),
      offsetY: Math.max(0, start - overscan) * itemHeight
    }
  }, [scrollTop, itemHeight, containerHeight, items.length])

  // Видимые элементы
  const visibleItems = items.slice(startIndex, endIndex + 1)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  const totalHeight = items.length * itemHeight

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Использование
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: \`Item \${i}\`
  }))

  return (
    <VirtualList
      items={items}
      itemHeight={50}
      containerHeight={400}
      renderItem={(item) => (
        <div className="item">{item.name}</div>
      )}
    />
  )
}

// С react-window (рекомендуется для продакшена)
import { FixedSizeList, VariableSizeList } from 'react-window'

function WindowedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )

  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'virtualization', 'performance', 'lists'],
    whyRelevant2026: 'Виртуализация обязательна для больших списков',
    related: ['react-memo', 'react-lazy-loading']
  },
  {
    id: 'react-code-splitting',
    title: 'Code Splitting',
    description: 'Ленивая загрузка компонентов',
    code: `import { lazy, Suspense, startTransition, useState } from 'react'

// Ленивый импорт компонента
const HeavyChart = lazy(() => import('./HeavyChart'))
const AdminPanel = lazy(() => import('./AdminPanel'))

// С named export
const Dashboard = lazy(() =>
  import('./Dashboard').then(module => ({
    default: module.Dashboard
  }))
)

// С prefetch
const Settings = lazy(() => {
  // Prefetch связанных модулей
  import('./SettingsAPI')
  return import('./Settings')
})

function App() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        Показать график
      </button>

      {/* Suspense для fallback при загрузке */}
      <Suspense fallback={<div>Загрузка графика...</div>}>
        {showChart && <HeavyChart />}
      </Suspense>
    </div>
  )
}

// Роутинг с lazy loading
import { Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Suspense>
  )
}

// Prefetch при hover
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const prefetch = () => {
    // Динамический import начинает загрузку
    if (to === '/about') import('./pages/About')
    if (to === '/contact') import('./pages/Contact')
  }

  return (
    <Link to={to} onMouseEnter={prefetch}>
      {children}
    </Link>
  )
}

// Transition для плавной смены
function TabsWithTransition() {
  const [tab, setTab] = useState('home')

  const handleTabChange = (newTab: string) => {
    startTransition(() => {
      setTab(newTab)
    })
  }

  return (
    <div>
      <nav>
        <button onClick={() => handleTabChange('home')}>Home</button>
        <button onClick={() => handleTabChange('profile')}>Profile</button>
      </nav>

      <Suspense fallback={<TabSkeleton />}>
        {tab === 'home' && <Home />}
        {tab === 'profile' && <Profile />}
      </Suspense>
    </div>
  )
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['react', 'lazy', 'suspense', 'code-splitting'],
    whyRelevant2026: 'Code splitting критичен для быстрой начальной загрузки',
    related: ['react-suspense', 'react-use-transition']
  }
]

export default performance
