import type { Snippet } from '@/types'

export const context: Snippet[] = [
  {
    id: 'react-context-basic',
    title: 'Базовый Context',
    description: 'Создание и использование React Context',
    code: `import { createContext, useContext, useState, ReactNode } from 'react'

// Типы
interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

// Создание контекста с дефолтным значением
const AuthContext = createContext<AuthContextType | null>(null)

// Provider компонент
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Кастомный хук для использования контекста
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Использование
function Profile() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <p>Войдите в систему</p>
  }

  return (
    <div>
      <p>Привет, {user?.name}!</p>
      <button onClick={logout}>Выйти</button>
    </div>
  )
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['react', 'context', 'state', 'hooks'],
    whyRelevant2026: 'Context остаётся основой для глобального состояния в React',
    related: ['react-context-reducer', 'react-context-selectors']
  },
  {
    id: 'react-context-reducer',
    title: 'Context с useReducer',
    description: 'Сложное состояние с редьюсером',
    code: `import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react'

// Типы состояния
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
}

// Типы экшенов
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }

// Редьюсер
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      }
    }
    case 'REMOVE_ITEM': {
      const item = state.items.find(i => i.id === action.payload)
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item ? item.price * item.quantity : 0)
      }
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 }
    default:
      return state
  }
}

// Контексты
const CartStateContext = createContext<CartState | null>(null)
const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null)

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  )
}

// Хуки
export function useCartState() {
  const context = useContext(CartStateContext)
  if (!context) throw new Error('useCartState must be within CartProvider')
  return context
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext)
  if (!context) throw new Error('useCartDispatch must be within CartProvider')
  return context
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'context', 'reducer', 'state'],
    whyRelevant2026: 'Разделение state и dispatch предотвращает лишние ре-рендеры',
    related: ['react-context-basic', 'react-use-reducer']
  },
  {
    id: 'react-context-selectors',
    title: 'Context с селекторами',
    description: 'Оптимизация ре-рендеров через селекторы',
    code: `import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useSyncExternalStore,
  ReactNode
} from 'react'

// Утилита для создания store с селекторами
function createStore<T>(initialState: T) {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    setState: (newState: Partial<T> | ((prev: T) => Partial<T>)) => {
      state = {
        ...state,
        ...(typeof newState === 'function' ? newState(state) : newState)
      }
      listeners.forEach(listener => listener())
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

// Типы
interface AppState {
  user: { name: string } | null
  theme: 'light' | 'dark'
  notifications: number
}

type Store = ReturnType<typeof createStore<AppState>>

const StoreContext = createContext<Store | null>(null)

// Provider
export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<Store>()
  if (!storeRef.current) {
    storeRef.current = createStore<AppState>({
      user: null,
      theme: 'light',
      notifications: 0
    })
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

// Хук с селектором
export function useStore<Selected>(
  selector: (state: AppState) => Selected
): Selected {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be within StoreProvider')

  return useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector])
  )
}

// Хук для обновления
export function useStoreUpdate() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStoreUpdate must be within StoreProvider')
  return store.setState
}

// Использование - компонент ре-рендерится только при изменении theme
function ThemeToggle() {
  const theme = useStore(state => state.theme)
  const update = useStoreUpdate()

  return (
    <button onClick={() => update({ theme: theme === 'light' ? 'dark' : 'light' })}>
      {theme}
    </button>
  )
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'context', 'selectors', 'performance'],
    whyRelevant2026: 'useSyncExternalStore - правильный способ подписки на внешние stores',
    related: ['react-context-reducer', 'react-use-sync-external-store']
  },
  {
    id: 'react-context-composition',
    title: 'Композиция провайдеров',
    description: 'Организация множества контекстов',
    code: `import { ReactNode } from 'react'

// Утилита для композиции провайдеров
function composeProviders(
  ...providers: Array<React.ComponentType<{ children: ReactNode }>>
) {
  return function ComposedProviders({ children }: { children: ReactNode }) {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    )
  }
}

// Провайдеры
import { AuthProvider } from './AuthContext'
import { ThemeProvider } from './ThemeContext'
import { CartProvider } from './CartContext'
import { NotificationProvider } from './NotificationContext'

// Композиция
const AppProviders = composeProviders(
  AuthProvider,
  ThemeProvider,
  CartProvider,
  NotificationProvider
)

// Использование
function App() {
  return (
    <AppProviders>
      <Router>
        <Layout />
      </Router>
    </AppProviders>
  )
}

// Альтернатива: явная вложенность с props
function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system">
        <CartProvider persistKey="cart">
          <NotificationProvider position="top-right">
            {children}
          </NotificationProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

// Ленивая инициализация контекста
function LazyProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Асинхронная инициализация
    initializeService().then(() => setIsReady(true))
  }, [])

  if (!isReady) {
    return <LoadingScreen />
  }

  return <ServiceProvider>{children}</ServiceProvider>
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['react', 'context', 'composition', 'patterns'],
    whyRelevant2026: 'Композиция провайдеров упрощает управление зависимостями',
    related: ['react-context-basic', 'react-compound-components']
  },
  {
    id: 'react-context-module',
    title: 'Context Module Pattern',
    description: 'Организация контекста в модуль',
    code: `// features/theme/context.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react'

// Types
type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// Context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// Utils
function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getStoredTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) || 'system'
}

// Provider
interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    getStoredTheme() || defaultTheme
  )

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(storageKey, newTheme)
  }, [storageKey])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }, [resolvedTheme, setTheme])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  // Listen for system changes
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => theme === 'system' && setThemeState('system')
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Re-export everything from module
export { type Theme, type ThemeContextValue }`,
    language: 'ts',
    level: 'intermediate',
    tags: ['react', 'context', 'module', 'patterns'],
    whyRelevant2026: 'Модульная организация упрощает переиспользование и тестирование',
    related: ['react-context-basic', 'react-custom-hooks']
  },
  {
    id: 'react-context-testing',
    title: 'Тестирование Context',
    description: 'Паттерны тестирования компонентов с контекстом',
    code: `import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

// Тестовый компонент
function TestComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()

  return (
    <div>
      <p data-testid="status">{isAuthenticated ? 'logged-in' : 'logged-out'}</p>
      {user && <p data-testid="user">{user.name}</p>}
      <button onClick={() => login({ id: '1', name: 'Test', email: 'test@test.com' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

// Wrapper для тестов
function renderWithAuth(ui: React.ReactElement, options = {}) {
  return render(
    <AuthProvider>{ui}</AuthProvider>,
    options
  )
}

// Тесты
describe('AuthContext', () => {
  it('provides initial state', () => {
    renderWithAuth(<TestComponent />)
    expect(screen.getByTestId('status')).toHaveTextContent('logged-out')
  })

  it('allows login', async () => {
    const user = userEvent.setup()
    renderWithAuth(<TestComponent />)

    await user.click(screen.getByText('Login'))

    expect(screen.getByTestId('status')).toHaveTextContent('logged-in')
    expect(screen.getByTestId('user')).toHaveTextContent('Test')
  })

  it('allows logout', async () => {
    const user = userEvent.setup()
    renderWithAuth(<TestComponent />)

    await user.click(screen.getByText('Login'))
    await user.click(screen.getByText('Logout'))

    expect(screen.getByTestId('status')).toHaveTextContent('logged-out')
  })

  it('throws error when used outside provider', () => {
    // Подавляем console.error для этого теста
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within AuthProvider'
    )

    spy.mockRestore()
  })
})

// Mock provider для unit тестов компонентов
function MockAuthProvider({
  children,
  value
}: {
  children: React.ReactNode
  value: Partial<ReturnType<typeof useAuth>>
}) {
  const defaultValue = {
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: false,
    ...value
  }

  return (
    <AuthContext.Provider value={defaultValue}>
      {children}
    </AuthContext.Provider>
  )
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'context', 'testing', 'jest'],
    whyRelevant2026: 'Тестирование контекста критично для надёжности приложения',
    related: ['react-context-basic', 'react-testing-library']
  }
]

export default context
