import type { Snippet } from '@/types'

export const advancedSnippets: Snippet[] = [
  {
    id: 'discriminated-unions',
    title: 'Discriminated Unions',
    description: 'Размеченные объединения с общим полем-дискриминантом. Основа для type-safe state machines и Redux actions.',
    code: `// Discriminated union с полем type
type Result<T, E = Error> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: E }
  | { status: 'loading' }

function handleResult<T>(result: Result<T>) {
  switch (result.status) {
    case 'success':
      // TypeScript знает что здесь есть data
      console.log(result.data)
      break
    case 'error':
      // TypeScript знает что здесь есть error
      console.error(result.error.message)
      break
    case 'loading':
      // Нет дополнительных полей
      console.log('Loading...')
      break
  }
}

// Redux-style actions
type Action =
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'RESET' }

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.payload
    case 'DECREMENT':
      return state - action.payload
    case 'RESET':
      return 0
  }
}

// API Response типы
type ApiResponse<T> =
  | { ok: true; data: T; status: 200 | 201 }
  | { ok: false; error: string; status: 400 | 404 | 500 }

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  // ...
}

const response = await fetchUser('1')
if (response.ok) {
  console.log(response.data.name) // ✅ TypeScript знает что data существует
} else {
  console.error(response.error)   // ✅ TypeScript знает что error существует
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['discriminated-unions', 'type-narrowing', 'redux', 'state'],
    preview: "{ status: 'success'; data: T } | { status: 'error' }",
    whyRelevant2026: 'Discriminated unions — стандарт для state management. Используются в Redux Toolkit, XState, и всех modern state libraries.',
    related: ['type-guards', 'exhaustive-check'],
  },
  {
    id: 'type-guards',
    title: 'Type Guards',
    description: 'Пользовательские type guards для сужения типов. Позволяют TypeScript понять структуру данных в runtime.',
    code: `// Type predicate — функция возвращает x is Type
interface User {
  type: 'user'
  name: string
  email: string
}

interface Admin {
  type: 'admin'
  name: string
  permissions: string[]
}

type Person = User | Admin

// Type guard функция
function isAdmin(person: Person): person is Admin {
  return person.type === 'admin'
}

function handlePerson(person: Person) {
  if (isAdmin(person)) {
    // TypeScript знает что person — Admin
    console.log(person.permissions)
  } else {
    // TypeScript знает что person — User
    console.log(person.email)
  }
}

// Type guard для проверки наличия свойства
function hasProperty<T extends object, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj
}

const data: unknown = { name: 'Alice', age: 30 }

if (hasProperty(data, 'name')) {
  console.log(data.name) // ✅ TypeScript знает что name существует
}

// Array type guard
function isStringArray(arr: unknown[]): arr is string[] {
  return arr.every(item => typeof item === 'string')
}

// Non-null assertion guard
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error('Value is not defined')
  }
}

function process(value: string | null) {
  assertDefined(value)
  // После assert TypeScript знает что value — string
  console.log(value.toUpperCase())
}

// Assertion function
function assertIsError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw new Error('Not an Error instance')
  }
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['type-guards', 'type-narrowing', 'predicates', 'assertions'],
    preview: 'function isAdmin(p): p is Admin',
    whyRelevant2026: 'Type guards обеспечивают runtime type safety. Критичны для работы с API responses и unknown данными.',
    related: ['discriminated-unions', 'unknown-type'],
  },
  {
    id: 'exhaustive-check',
    title: 'Exhaustive Check',
    description: 'Исчерпывающая проверка для гарантии обработки всех вариантов union типа.',
    code: `// never тип для exhaustive check
type Status = 'pending' | 'approved' | 'rejected'

function assertNever(value: never): never {
  throw new Error(\`Unexpected value: \${value}\`)
}

function getStatusMessage(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Ожидает рассмотрения'
    case 'approved':
      return 'Одобрено'
    case 'rejected':
      return 'Отклонено'
    default:
      // Если добавить новый статус и забыть обработать —
      // TypeScript выдаст ошибку здесь
      return assertNever(status)
  }
}

// Добавим новый статус
type StatusV2 = 'pending' | 'approved' | 'rejected' | 'review'

function getStatusMessageV2(status: StatusV2): string {
  switch (status) {
    case 'pending':
      return 'Ожидает'
    case 'approved':
      return 'Одобрено'
    case 'rejected':
      return 'Отклонено'
    // Забыли case 'review'
    default:
      return assertNever(status)
      // ❌ Error: Argument of type 'string' is not assignable to 'never'
  }
}

// Практический пример с Redux actions
type Action =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }

function todoReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.payload, done: false }]
    case 'TOGGLE_TODO':
      return state.map(t => t.id === action.payload ? { ...t, done: !t.done } : t)
    case 'DELETE_TODO':
      return state.filter(t => t.id !== action.payload)
    default:
      // Гарантирует что все actions обработаны
      return assertNever(action)
  }
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['exhaustive-check', 'never', 'switch', 'type-safety'],
    preview: 'assertNever(status)',
    whyRelevant2026: 'Exhaustive checks предотвращают баги при добавлении новых вариантов. Стандарт для reducers и state machines.',
    related: ['discriminated-unions', 'never-type'],
  },
  {
    id: 'branded-types',
    title: 'Branded Types',
    description: 'Номинальные типы через брендирование. Позволяют различать структурно идентичные типы.',
    code: `// Branded type — добавляем уникальный символ
declare const brand: unique symbol

type Brand<T, B> = T & { [brand]: B }

// Создаём branded типы
type UserId = Brand<string, 'UserId'>
type PostId = Brand<string, 'PostId'>
type Email = Brand<string, 'Email'>

// Функции-конструкторы с валидацией
function createUserId(id: string): UserId {
  if (!id.startsWith('user_')) {
    throw new Error('Invalid user ID format')
  }
  return id as UserId
}

function createEmail(email: string): Email {
  if (!email.includes('@')) {
    throw new Error('Invalid email format')
  }
  return email as Email
}

// Использование
function getUser(id: UserId): User {
  // fetch user
}

function getPost(id: PostId): Post {
  // fetch post
}

const userId = createUserId('user_123')
const postId = 'post_456' as PostId

getUser(userId)   // ✅
getUser(postId)   // ❌ Type error! PostId не совместим с UserId

// Практический пример: validated types
type PositiveNumber = Brand<number, 'Positive'>
type NonEmptyString = Brand<string, 'NonEmpty'>

function toPositive(n: number): PositiveNumber {
  if (n <= 0) throw new Error('Must be positive')
  return n as PositiveNumber
}

function divide(a: number, b: PositiveNumber): number {
  return a / b // Безопасно — b гарантированно > 0
}

// Currency branded types
type USD = Brand<number, 'USD'>
type EUR = Brand<number, 'EUR'>

function addUSD(a: USD, b: USD): USD {
  return (a + b) as USD
}

const dollars = 100 as USD
const euros = 50 as EUR

addUSD(dollars, dollars)  // ✅
addUSD(dollars, euros)    // ❌ Нельзя складывать разные валюты`,
    language: 'ts',
    level: 'advanced',
    tags: ['branded-types', 'nominal-typing', 'type-safety', 'validation'],
    preview: 'type UserId = Brand<string, "UserId">',
    whyRelevant2026: 'Branded types предотвращают логические ошибки. Используются в финансовых приложениях, ID-системах, и validated forms.',
    related: ['type-guards', 'discriminated-unions'],
  },
  {
    id: 'const-assertions',
    title: 'Const Assertions',
    description: 'as const для создания literal types и readonly структур. Улучшает type inference.',
    code: `// as const делает значения literal types
const colors = ['red', 'green', 'blue'] as const
// readonly ['red', 'green', 'blue']

type Color = typeof colors[number]
// 'red' | 'green' | 'blue'

// Без as const
const sizes = ['sm', 'md', 'lg']
type Size = typeof sizes[number]  // string (не то что нужно)

// С as const
const sizesConst = ['sm', 'md', 'lg'] as const
type SizeConst = typeof sizesConst[number]  // 'sm' | 'md' | 'lg'

// Object as const
const config = {
  api: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
} as const

type Config = typeof config
// { readonly api: 'https://api.example.com'; readonly timeout: 5000; readonly retries: 3 }

// Практический пример: route definitions
const routes = {
  home: '/',
  users: '/users',
  user: '/users/:id',
  posts: '/posts',
} as const

type Route = typeof routes[keyof typeof routes]
// '/' | '/users' | '/users/:id' | '/posts'

// Enum-like pattern с as const
const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const

type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus]
// 200 | 201 | 400 | 404 | 500

// satisfies + as const для лучшего inference
const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
  },
} as const satisfies Record<string, Record<string, string | number>>

// TypeScript знает точные значения
theme.colors.primary  // '#007bff' (не просто string)
theme.spacing.md      // 16 (не просто number)`,
    language: 'ts',
    level: 'intermediate',
    tags: ['const-assertions', 'literal-types', 'readonly', 'satisfies'],
    preview: "const colors = ['red', 'green'] as const",
    whyRelevant2026: 'as const + satisfies — мощная комбинация для конфигов. Обеспечивает точную типизацию без дублирования.',
    related: ['satisfies-operator', 'template-literal-types'],
  },
  {
    id: 'satisfies-operator',
    title: 'Satisfies Operator',
    description: 'Оператор satisfies для проверки типа без расширения. Сохраняет inference при валидации.',
    code: `// satisfies проверяет тип, но сохраняет inference
type Colors = Record<string, string | number[]>

// Без satisfies — теряем точность
const palette1: Colors = {
  red: '#ff0000',
  green: '#00ff00',
  blue: [0, 0, 255],
}
palette1.red.toUpperCase()  // ❌ Error: string | number[]

// С satisfies — сохраняем точность
const palette2 = {
  red: '#ff0000',
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies Colors

palette2.red.toUpperCase()  // ✅ TypeScript знает что это string
palette2.blue.map(x => x)   // ✅ TypeScript знает что это number[]

// Практический пример: конфигурация
interface Config {
  port: number
  host: string
  ssl: boolean
}

const config = {
  port: 3000,
  host: 'localhost',
  ssl: false,
  // debug: true  // ❌ Error: лишнее свойство
} satisfies Config

// config.port имеет тип 3000 (literal), не number

// Route definitions с satisfies
type RouteConfig = {
  path: string
  component: React.ComponentType
  exact?: boolean
}

const routes = {
  home: { path: '/', component: HomePage, exact: true },
  users: { path: '/users', component: UsersPage },
  // Typo будет пойман: paths вместо path
} satisfies Record<string, RouteConfig>

// as const + satisfies
const API_ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments',
} as const satisfies Record<string, string>

type Endpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]
// '/api/users' | '/api/posts' | '/api/comments'`,
    language: 'ts',
    level: 'intermediate',
    tags: ['satisfies', 'type-inference', 'config', 'validation'],
    preview: 'const config = { ... } satisfies Config',
    whyRelevant2026: 'satisfies (TS 4.9+) решает давнюю проблему потери inference. Стандарт для конфигураций и констант.',
    related: ['const-assertions', 'type-guards'],
  },
  {
    id: 'keyof-typeof',
    title: 'keyof & typeof',
    description: 'Операторы keyof и typeof для извлечения типов из значений и ключей объектов.',
    code: `// typeof извлекает тип из значения
const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@mail.com',
}

type User = typeof user
// { id: number; name: string; email: string }

// keyof извлекает union ключей
type UserKeys = keyof typeof user
// 'id' | 'name' | 'email'

// Практический пример: типизация Object.keys
function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

const keys = typedKeys(user)  // ('id' | 'name' | 'email')[]

// Типизация Object.entries
function typedEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

// typeof с функциями
function createUser(name: string, email: string) {
  return { id: Math.random(), name, email, createdAt: new Date() }
}

type CreatedUser = ReturnType<typeof createUser>
// { id: number; name: string; email: string; createdAt: Date }

// keyof с index signatures
interface Dictionary {
  [key: string]: number
}

type DictKey = keyof Dictionary  // string | number

// keyof с mapped types
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

type UserGetters = Getters<User>
// { getId: () => number; getName: () => string; getEmail: () => string }

// Комбинация с generic
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const name = getProperty(user, 'name')  // string
const id = getProperty(user, 'id')      // number`,
    language: 'ts',
    level: 'intermediate',
    tags: ['keyof', 'typeof', 'type-operators', 'inference'],
    preview: 'keyof typeof obj',
    whyRelevant2026: 'keyof/typeof — основа для создания type-safe утилит. Широко используются в form libraries и ORM.',
    related: ['mapped-types', 'generic-constraints'],
  },
  {
    id: 'unknown-type',
    title: 'Unknown Type',
    description: 'Тип unknown как безопасная альтернатива any. Требует проверки типа перед использованием.',
    code: `// unknown vs any
let anyValue: any = 'hello'
anyValue.foo()  // ✅ Компилируется, но может упасть в runtime

let unknownValue: unknown = 'hello'
// unknownValue.foo()  // ❌ Error: Object is of type 'unknown'

// Нужно сначала проверить тип
if (typeof unknownValue === 'string') {
  unknownValue.toUpperCase()  // ✅ Теперь безопасно
}

// Паттерн для обработки ошибок
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown error'
}

try {
  throw new Error('Something went wrong')
} catch (error) {
  // В TypeScript 4.4+ error имеет тип unknown
  const message = handleError(error)
}

// Type guard для unknown
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseJSON(json: string): unknown {
  return JSON.parse(json)
}

const data = parseJSON('{"name": "Alice"}')

if (isRecord(data) && typeof data.name === 'string') {
  console.log(data.name)  // ✅ Безопасно
}

// Практический пример: API response validation
interface User {
  id: number
  name: string
}

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string'
  )
}

async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user')
  const data: unknown = await response.json()

  if (!isUser(data)) {
    throw new Error('Invalid user data')
  }

  return data  // TypeScript знает что это User
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['unknown', 'type-safety', 'error-handling', 'type-guards'],
    preview: 'function handle(error: unknown)',
    whyRelevant2026: 'unknown — стандарт для внешних данных. В TS 5.x улучшена работа с unknown через control flow analysis.',
    related: ['type-guards', 'discriminated-unions'],
  },
  {
    id: 'never-type',
    title: 'Never Type',
    description: 'Тип never для представления невозможных значений. Используется в exhaustive checks и unreachable code.',
    code: `// never — тип для невозможных значений
function throwError(message: string): never {
  throw new Error(message)
}

function infiniteLoop(): never {
  while (true) {
    // никогда не завершится
  }
}

// never в conditional types
type NonNullable<T> = T extends null | undefined ? never : T

type A = NonNullable<string | null>  // string

// Exhaustive check с never
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.side ** 2
    default:
      // Если добавить новую shape и забыть обработать —
      // TypeScript выдаст ошибку
      const _exhaustive: never = shape
      return _exhaustive
  }
}

// never в union исчезает
type A = string | never  // string
type B = string & never  // never

// Практический пример: unreachable code detection
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  } else if (typeof value === 'number') {
    return value.toFixed(2)
  } else {
    // value здесь имеет тип never
    // Этот код никогда не выполнится
    const impossible: never = value
    return impossible
  }
}

// never в дженериках
type IsNever<T> = [T] extends [never] ? true : false

type A = IsNever<never>   // true
type B = IsNever<string>  // false

// Функция которая никогда не возвращает
function fail(message: string): never {
  console.error(message)
  throw new Error(message)
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['never', 'exhaustive-check', 'type-system', 'unreachable'],
    preview: 'function fail(): never',
    whyRelevant2026: 'never — ключ к exhaustive checks. Предотвращает баги при добавлении новых вариантов в union types.',
    related: ['exhaustive-check', 'discriminated-unions'],
  },
  {
    id: 'declaration-merging',
    title: 'Declaration Merging',
    description: 'Слияние деклараций для расширения существующих типов и интерфейсов.',
    code: `// Interface merging — интерфейсы с одинаковым именем сливаются
interface User {
  id: number
  name: string
}

interface User {
  email: string
}

// Результат: { id: number; name: string; email: string }
const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@mail.com',
}

// Расширение глобальных типов
declare global {
  interface Window {
    myApp: {
      version: string
      config: Record<string, unknown>
    }
  }
}

window.myApp = { version: '1.0.0', config: {} }

// Расширение библиотечных типов
declare module 'express' {
  interface Request {
    user?: {
      id: string
      role: 'admin' | 'user'
    }
  }
}

// Теперь req.user типизирован
app.get('/profile', (req, res) => {
  if (req.user) {
    console.log(req.user.id)
  }
})

// Namespace merging
namespace Validation {
  export function isEmail(s: string): boolean {
    return s.includes('@')
  }
}

namespace Validation {
  export function isPhone(s: string): boolean {
    return /^\d{10}$/.test(s)
  }
}

Validation.isEmail('test@mail.com')
Validation.isPhone('1234567890')

// Enum merging
enum Color {
  Red,
  Green,
}

enum Color {
  Blue = 2,
}

// Color теперь имеет Red, Green, Blue

// Module augmentation для npm пакетов
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError
  }
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['declaration-merging', 'module-augmentation', 'global-types'],
    preview: 'declare module "express"',
    whyRelevant2026: 'Declaration merging необходим для расширения типов библиотек. Используется в каждом серьёзном проекте.',
    related: ['generic-interface', 'ambient-declarations'],
  },
  {
    id: 'utility-types-custom',
    title: 'Custom Utility Types',
    description: 'Создание собственных utility types для повторного использования в проекте.',
    code: `// DeepPartial — рекурсивный Partial
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

interface Config {
  server: {
    host: string
    port: number
  }
  db: {
    url: string
    pool: {
      min: number
      max: number
    }
  }
}

const partialConfig: DeepPartial<Config> = {
  server: { port: 3000 },  // host не обязателен
}

// DeepReadonly
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T

// Nullable — добавляет null к типу
type Nullable<T> = T | null

// Optional — делает указанные ключи optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface User {
  id: number
  name: string
  email: string
}

type CreateUser = Optional<User, 'id'>
// { name: string; email: string; id?: number }

// RequiredKeys — извлекает обязательные ключи
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

// OptionalKeys — извлекает optional ключи
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

// Mutable — убирает readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

// PickByValue — выбирает ключи по типу значения
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}

interface Mixed {
  name: string
  age: number
  email: string
  active: boolean
}

type StringFields = PickByValue<Mixed, string>
// { name: string; email: string }

// OmitByValue
type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K]
}

// Promisify — оборачивает значения в Promise
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['utility-types', 'custom-types', 'mapped-types', 'conditional-types'],
    preview: 'type DeepPartial<T>',
    whyRelevant2026: 'Custom utility types экономят время и уменьшают дублирование. Стандартная практика в enterprise проектах.',
    related: ['mapped-types', 'conditional-types'],
  },
  {
    id: 'type-inference-patterns',
    title: 'Type Inference Patterns',
    description: 'Паттерны для улучшения автоматического вывода типов TypeScript.',
    code: `// Inference от аргументов функции
function createStore<T>(initial: T) {
  let state = initial
  return {
    get: () => state,
    set: (value: T) => { state = value },
  }
}

// T выводится из аргумента
const numberStore = createStore(0)      // T = number
const userStore = createStore({ name: 'Alice' })  // T = { name: string }

// Inference от return type
function identity<T>(value: T) {
  return value
}

const result = identity({ x: 1, y: 2 })
// result: { x: number; y: number }

// Inference в callbacks
const numbers = [1, 2, 3]
const doubled = numbers.map(n => n * 2)  // n выводится как number

// Constrained inference
function firstElement<T extends { length: number }>(arr: T): T[0] | undefined {
  return arr[0]
}

// Inference с as const
function defineRoutes<T extends Record<string, string>>(routes: T) {
  return routes
}

const routes = defineRoutes({
  home: '/',
  users: '/users',
} as const)

type RouteKey = keyof typeof routes  // 'home' | 'users'

// Builder pattern с inference
class QueryBuilder<T extends Record<string, unknown>> {
  private query: Partial<T> = {}

  where<K extends keyof T>(key: K, value: T[K]): this {
    this.query[key] = value
    return this
  }

  build(): Partial<T> {
    return this.query
  }
}

interface User {
  name: string
  age: number
  active: boolean
}

const query = new QueryBuilder<User>()
  .where('name', 'Alice')  // ✅ value должен быть string
  .where('age', 30)        // ✅ value должен быть number
  // .where('name', 123)   // ❌ Error
  .build()

// Function overloads для точного inference
function createElement(tag: 'a'): HTMLAnchorElement
function createElement(tag: 'div'): HTMLDivElement
function createElement(tag: 'input'): HTMLInputElement
function createElement(tag: string): HTMLElement {
  return document.createElement(tag)
}

const anchor = createElement('a')  // HTMLAnchorElement
const div = createElement('div')   // HTMLDivElement`,
    language: 'ts',
    level: 'advanced',
    tags: ['type-inference', 'generics', 'patterns', 'builder'],
    preview: 'function createStore<T>(initial: T)',
    whyRelevant2026: 'Хороший inference = меньше явных аннотаций. TypeScript 5.x значительно улучшил inference capabilities.',
    related: ['generic-function', 'const-assertions'],
  },
]
