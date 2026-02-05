import type { Snippet } from '@/types'

export const utilityTypesSnippets: Snippet[] = [
  {
    id: 'partial-type',
    title: 'Partial<T>',
    description:
      'Делает все свойства типа необязательными. Незаменим для функций обновления состояния и патч-запросов к API.',
    code: `// Partial<T> — все свойства становятся optional

interface User {
  id: number
  name: string
  email: string
  avatar: string
}

// Функция обновления — принимает только изменённые поля
function updateUser(id: number, updates: Partial<User>) {
  // updates может содержать любой набор полей User
  return fetch(\`/api/users/\${id}\`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

// Использование
updateUser(1, { name: 'Иван' })           // ✅ только name
updateUser(1, { email: 'new@mail.ru' })   // ✅ только email
updateUser(1, { name: 'Иван', avatar: '/img.png' }) // ✅ несколько полей

// React: обновление состояния формы
const [form, setForm] = useState<User>(initialUser)
const updateForm = (patch: Partial<User>) => {
  setForm(prev => ({ ...prev, ...patch }))
}`,
    language: 'ts',
    level: 'beginner',
    tags: ['utility-types', 'partial', 'forms', 'api', 'state'],
    preview: 'Partial<User>',
    whyRelevant2026:
      'Стандарт для типизации PATCH-запросов и частичных обновлений состояния. С ростом Server Actions в Next.js 15+ используется ещё чаще.',
    related: ['required-type', 'pick-type'],
  },
  {
    id: 'required-type',
    title: 'Required<T>',
    description:
      'Делает все свойства обязательными. Используется для валидации данных перед отправкой или для strict-режима конфигов.',
    code: `// Required<T> — все свойства становятся обязательными

interface Config {
  apiUrl?: string
  timeout?: number
  retries?: number
}

// Конфиг с дефолтами — все поля optional
const defaultConfig: Config = {
  timeout: 5000,
  retries: 3,
}

// После мерджа с дефолтами — все поля гарантированно есть
function initApp(userConfig: Config): Required<Config> {
  return {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3,
    ...userConfig,
  } as Required<Config>
}

// React: пропсы компонента после применения defaultProps
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const defaultProps: Required<ButtonProps> = {
  variant: 'primary',
  size: 'md',
  disabled: false,
}

function Button(props: ButtonProps) {
  const merged: Required<ButtonProps> = { ...defaultProps, ...props }
  // Теперь merged.variant, merged.size, merged.disabled — гарантированно есть
}`,
    language: 'tsx',
    level: 'beginner',
    tags: ['utility-types', 'required', 'config', 'validation', 'props'],
    preview: 'Required<Config>',
    whyRelevant2026:
      'Критичен для type-safe конфигураций. В 2026 с усилением типизации в экосистеме (Zod, Valibot) Required помогает гарантировать полноту данных.',
    related: ['partial-type', 'readonly-type'],
  },
  {
    id: 'pick-type',
    title: 'Pick<T, K>',
    description:
      'Создаёт тип только с выбранными свойствами. Идеален для DTO, публичных API и компонентов, которым нужна часть данных.',
    code: `// Pick<T, K> — выбираем только нужные свойства

interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
  role: 'admin' | 'user'
}

// DTO для списка пользователей — без sensitive данных
type UserListItem = Pick<User, 'id' | 'name' | 'email'>
// { id: number; name: string; email: string }

// DTO для профиля
type UserProfile = Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>

// React: пропсы карточки пользователя
interface UserCardProps {
  user: Pick<User, 'id' | 'name' | 'avatar'>
  onClick?: () => void
}

function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div onClick={onClick}>
      <img src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </div>
  )
}

// API response typing
async function getUsers(): Promise<Pick<User, 'id' | 'name' | 'email'>[]> {
  const res = await fetch('/api/users')
  return res.json()
}`,
    language: 'tsx',
    level: 'beginner',
    tags: ['utility-types', 'pick', 'dto', 'api', 'props', 'security'],
    preview: "Pick<User, 'id' | 'name'>",
    whyRelevant2026:
      'Основа безопасной работы с данными. Помогает не передавать лишние поля (password, tokens) на фронтенд. Критичен для GDPR-compliant приложений.',
    related: ['omit-type', 'partial-type'],
  },
  {
    id: 'omit-type',
    title: 'Omit<T, K>',
    description:
      'Создаёт тип без указанных свойств. Используется для исключения служебных полей или создания типов "без id" для создания сущностей.',
    code: `// Omit<T, K> — исключаем ненужные свойства

interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
}

// Тип для создания пользователя — без id и createdAt (генерируются сервером)
type CreateUserDTO = Omit<User, 'id' | 'createdAt'>
// { name: string; email: string; password: string }

// Тип для публичного API — без password
type PublicUser = Omit<User, 'password'>

// React: расширение пропсов без конфликтов
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant: 'primary' | 'secondary'
  // Переопределяем type с более строгим типом
  type?: 'button' | 'submit'
}

// Паттерн для форм: тип данных без служебных полей
interface Post {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

type PostFormData = Omit<Post, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>
// { title: string; content: string }

function CreatePostForm({ onSubmit }: { onSubmit: (data: PostFormData) => void }) {
  // Форма работает только с title и content
}`,
    language: 'tsx',
    level: 'beginner',
    tags: ['utility-types', 'omit', 'dto', 'forms', 'props'],
    preview: "Omit<User, 'password'>",
    whyRelevant2026:
      'Стандарт для DTO паттернов. В React 19 с новыми form actions Omit используется для типизации данных форм без служебных полей.',
    related: ['pick-type', 'partial-type'],
  },
  {
    id: 'record-type',
    title: 'Record<K, V>',
    description:
      'Создаёт объектный тип с ключами K и значениями V. Идеален для словарей, маппингов и нормализованных данных.',
    code: `// Record<K, V> — типизированный объект-словарь

// Словарь статусов
type Status = 'pending' | 'active' | 'completed' | 'error'

const statusLabels: Record<Status, string> = {
  pending: 'Ожидание',
  active: 'Активен',
  completed: 'Завершён',
  error: 'Ошибка',
}

const statusColors: Record<Status, string> = {
  pending: 'bg-yellow-500',
  active: 'bg-green-500',
  completed: 'bg-blue-500',
  error: 'bg-red-500',
}

// Нормализованные данные (как в Redux/Zustand)
interface User {
  id: string
  name: string
}

type UsersById = Record<string, User>

const users: UsersById = {
  'user-1': { id: 'user-1', name: 'Анна' },
  'user-2': { id: 'user-2', name: 'Борис' },
}

// React: маппинг роутов на компоненты
type RouteConfig = Record<string, React.ComponentType>

const routes: RouteConfig = {
  '/': HomePage,
  '/about': AboutPage,
  '/users': UsersPage,
}

// Валидация форм: ошибки по полям
interface FormFields {
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>
// { email?: string; password?: string }

const errors: FormErrors = {
  email: 'Неверный формат email',
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['utility-types', 'record', 'dictionary', 'mapping', 'normalization'],
    preview: 'Record<Status, string>',
    whyRelevant2026:
      'Основа нормализации данных в state-менеджерах. С ростом Zustand и Jotai Record используется для типизации атомов и слайсов.',
    related: ['partial-type', 'pick-type'],
  },
  {
    id: 'readonly-type',
    title: 'Readonly<T>',
    description:
      'Делает все свойства доступными только для чтения. Гарантирует иммутабельность на уровне типов.',
    code: `// Readonly<T> — все свойства становятся readonly

interface State {
  user: User | null
  isLoading: boolean
  error: string | null
}

// Иммутабельное состояние
type ImmutableState = Readonly<State>

const state: ImmutableState = {
  user: null,
  isLoading: false,
  error: null,
}

// state.isLoading = true // ❌ Error: Cannot assign to 'isLoading'

// React: иммутабельные пропсы
interface UserProfileProps {
  user: Readonly<User>
  onEdit?: () => void
}

function UserProfile({ user }: UserProfileProps) {
  // user.name = 'New' // ❌ Error — нельзя мутировать
  return <div>{user.name}</div>
}

// Константы приложения
const CONFIG = {
  API_URL: 'https://api.example.com',
  MAX_RETRIES: 3,
  TIMEOUT: 5000,
} as const satisfies Readonly<Record<string, string | number>>

// Deep Readonly для вложенных объектов
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

interface NestedConfig {
  api: { url: string; timeout: number }
  features: { darkMode: boolean }
}

const config: DeepReadonly<NestedConfig> = {
  api: { url: 'https://api.example.com', timeout: 5000 },
  features: { darkMode: true },
}
// config.api.url = 'new' // ❌ Error`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['utility-types', 'readonly', 'immutability', 'state', 'const'],
    preview: 'Readonly<State>',
    whyRelevant2026:
      'Иммутабельность — основа React. С React 19 Compiler автоматическая мемоизация работает лучше с Readonly типами.',
    related: ['required-type', 'partial-type'],
  },
  {
    id: 'exclude-type',
    title: 'Exclude<T, U>',
    description:
      'Исключает из union-типа T те типы, которые присваиваются U. Используется для сужения типов и создания подмножеств.',
    code: `// Exclude<T, U> — исключаем типы из union

type AllEvents = 'click' | 'hover' | 'focus' | 'blur' | 'scroll'

// События без scroll (для мобильных)
type TouchEvents = Exclude<AllEvents, 'scroll'>
// 'click' | 'hover' | 'focus' | 'blur'

// Исключаем несколько типов
type KeyboardOnlyEvents = Exclude<AllEvents, 'click' | 'hover' | 'scroll'>
// 'focus' | 'blur'

// React: фильтрация пропсов
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'

// Варианты только для важных действий
type ActionButtonVariant = Exclude<ButtonVariant, 'ghost' | 'link'>
// 'primary' | 'secondary' | 'danger'

interface ActionButtonProps {
  variant: ActionButtonVariant
  onClick: () => void
}

// Исключение null/undefined из типа
type MaybeString = string | null | undefined
type DefinitelyString = Exclude<MaybeString, null | undefined>
// string

// Фильтрация типов событий
type FormEvent = 'submit' | 'reset' | 'change' | 'blur'
type SubmitEvents = Exclude<FormEvent, 'change' | 'blur'>
// 'submit' | 'reset'

// Продвинутый пример: исключение по условию
type Primitive = string | number | boolean | null | undefined
type NonNullPrimitive = Exclude<Primitive, null | undefined>
// string | number | boolean`,
    language: 'ts',
    level: 'intermediate',
    tags: ['utility-types', 'exclude', 'union', 'filtering', 'narrowing'],
    preview: "Exclude<Events, 'scroll'>",
    whyRelevant2026:
      'Ключевой инструмент для type narrowing. В больших проектах помогает создавать строгие подтипы без дублирования.',
    related: ['extract-type', 'nonnullable-type'],
  },
  {
    id: 'extract-type',
    title: 'Extract<T, U>',
    description:
      'Извлекает из union-типа T только те типы, которые присваиваются U. Противоположность Exclude — оставляет только совпадающие.',
    code: `// Extract<T, U> — извлекаем совпадающие типы

type AllResponses =
  | { status: 'success'; data: User }
  | { status: 'error'; error: string }
  | { status: 'loading' }
  | { status: 'idle' }

// Только успешные и ошибочные (с payload)
type ResponseWithPayload = Extract<AllResponses, { data: unknown } | { error: unknown }>
// { status: 'success'; data: User } | { status: 'error'; error: string }

// React: извлечение определённых событий
type MouseEvent = 'click' | 'dblclick' | 'mouseenter' | 'mouseleave'
type KeyEvent = 'keydown' | 'keyup' | 'keypress'
type AllEvents = MouseEvent | KeyEvent

type OnlyMouseEvents = Extract<AllEvents, MouseEvent>
// 'click' | 'dblclick' | 'mouseenter' | 'mouseleave'

// Извлечение функций из union
type Mixed = string | number | (() => void) | ((x: number) => number)
type OnlyFunctions = Extract<Mixed, Function>
// (() => void) | ((x: number) => number)

// Паттерн: типизация action creators
type Action =
  | { type: 'user/login'; payload: User }
  | { type: 'user/logout' }
  | { type: 'cart/add'; payload: Product }
  | { type: 'cart/clear' }

// Только user actions
type UserAction = Extract<Action, { type: \`user/\${string}\` }>
// { type: 'user/login'; payload: User } | { type: 'user/logout' }

// Извлечение по наличию поля
type WithPayload = Extract<Action, { payload: unknown }>
// Actions с payload`,
    language: 'ts',
    level: 'intermediate',
    tags: ['utility-types', 'extract', 'union', 'filtering', 'pattern-matching'],
    preview: "Extract<Response, { data: unknown }>",
    whyRelevant2026:
      'Мощный инструмент для работы с discriminated unions. Особенно полезен с template literal types для фильтрации actions.',
    related: ['exclude-type', 'nonnullable-type'],
  },
  {
    id: 'nonnullable-type',
    title: 'NonNullable<T>',
    description:
      'Исключает null и undefined из типа. Незаменим после проверок на null или при работе с опциональными данными.',
    code: `// NonNullable<T> — убираем null и undefined

type MaybeUser = User | null | undefined

// После проверки user !== null
type DefiniteUser = NonNullable<MaybeUser>
// User

// React: типизация после optional chaining
interface Props {
  user?: User | null
}

function Profile({ user }: Props) {
  if (!user) return <div>No user</div>

  // После проверки TypeScript знает, что user — не null
  // Но иногда нужно явно указать тип для передачи дальше
  return <UserCard user={user as NonNullable<typeof user>} />
}

// Паттерн: unwrap optional поля
interface ApiResponse {
  data?: {
    user?: User | null
    settings?: Settings | null
  } | null
}

function processResponse(response: ApiResponse) {
  const data = response.data
  if (!data) return null

  const user: NonNullable<typeof data.user> | null = data.user ?? null
  // user теперь User | null (без undefined)
}

// Утилита для массивов с возможными null
function filterNullable<T>(arr: (T | null | undefined)[]): NonNullable<T>[] {
  return arr.filter((item): item is NonNullable<T> => item != null)
}

const users = [user1, null, user2, undefined, user3]
const validUsers = filterNullable(users)
// User[] — без null и undefined`,
    language: 'tsx',
    level: 'beginner',
    tags: ['utility-types', 'nonnullable', 'null-safety', 'type-guard'],
    preview: 'NonNullable<MaybeUser>',
    whyRelevant2026:
      'Обязателен для strict null checks. С TypeScript 5.x улучшенный control flow analysis делает NonNullable ещё полезнее.',
    related: ['exclude-type', 'extract-type'],
  },
  {
    id: 'parameters-type',
    title: 'Parameters<T>',
    description:
      'Извлекает типы параметров функции в виде tuple. Позволяет переиспользовать сигнатуры функций без дублирования.',
    code: `// Parameters<T> — получаем типы аргументов функции

function createUser(name: string, email: string, role: 'admin' | 'user') {
  return { name, email, role, id: crypto.randomUUID() }
}

// Извлекаем типы параметров
type CreateUserParams = Parameters<typeof createUser>
// [name: string, email: string, role: 'admin' | 'user']

// Используем для wrapper-функции
function createUserWithLog(...args: CreateUserParams) {
  console.log('Creating user:', args[0])
  return createUser(...args)
}

// React: типизация event handlers
type ClickHandler = (event: React.MouseEvent, id: string) => void

type ClickHandlerParams = Parameters<ClickHandler>
// [event: React.MouseEvent, id: string]

// Паттерн: debounce с сохранением типов
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const debouncedSearch = debounce(
  (query: string, filters: Filters) => search(query, filters),
  300
)
// debouncedSearch сохраняет типы: (query: string, filters: Filters) => void

// Извлечение первого параметра
type FirstParam<T extends (...args: unknown[]) => unknown> = Parameters<T>[0]

type SearchQuery = FirstParam<typeof search>
// string`,
    language: 'ts',
    level: 'advanced',
    tags: ['utility-types', 'parameters', 'functions', 'generics', 'inference'],
    preview: 'Parameters<typeof fn>',
    whyRelevant2026:
      'Основа для HOF и утилит. С ростом функционального подхода в React (hooks, Server Actions) Parameters критичен для type-safe оберток.',
    related: ['returntype-type', 'partial-type'],
  },
]
