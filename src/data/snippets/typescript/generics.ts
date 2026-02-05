import type { Snippet } from '@/types'

export const genericsSnippets: Snippet[] = [
  {
    id: 'generic-function',
    title: 'Generic Function',
    description: 'Базовая generic-функция для работы с любыми типами. Основа типобезопасного переиспользуемого кода.',
    code: `// Generic функция — T выводится из аргумента
function identity<T>(value: T): T {
  return value
}

// TypeScript выводит тип автоматически
const str = identity('hello')    // string
const num = identity(42)         // number
const obj = identity({ a: 1 })   // { a: number }

// Явное указание типа
const explicit = identity<string[]>(['a', 'b'])

// Практический пример: первый элемент массива
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const users = [{ name: 'Alice' }, { name: 'Bob' }]
const firstUser = first(users) // { name: string } | undefined

// Generic с ограничением
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }
const name = getProperty(user, 'name') // string
const age = getProperty(user, 'age')   // number`,
    language: 'ts',
    level: 'intermediate',
    tags: ['generics', 'functions', 'type-inference', 'reusable'],
    preview: 'function identity<T>(value: T): T',
    whyRelevant2026: 'Generics — основа современного TypeScript. С улучшенным type inference в TS 5.x писать generic код стало проще.',
    related: ['generic-constraints', 'generic-interface'],
  },
  {
    id: 'generic-constraints',
    title: 'Generic Constraints',
    description: 'Ограничения generic-типов через extends. Позволяют требовать определённую структуру типа.',
    code: `// Базовое ограничение — T должен иметь length
function logLength<T extends { length: number }>(value: T): T {
  console.log(value.length)
  return value
}

logLength('hello')     // ✅ string имеет length
logLength([1, 2, 3])   // ✅ array имеет length
logLength({ length: 5 }) // ✅ объект с length
// logLength(123)      // ❌ number не имеет length

// Ограничение через интерфейс
interface HasId {
  id: string | number
}

function findById<T extends HasId>(items: T[], id: T['id']): T | undefined {
  return items.find(item => item.id === id)
}

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]
const found = findById(users, 1) // { id: number; name: string } | undefined

// Множественные ограничения
interface Printable {
  print(): void
}

interface Loggable {
  log(): void
}

function process<T extends Printable & Loggable>(item: T) {
  item.print()
  item.log()
}

// keyof constraint
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(key => obj[key])
}

const user = { name: 'Alice', age: 30, email: 'alice@mail.com' }
const values = pluck(user, ['name', 'email']) // (string)[]`,
    language: 'ts',
    level: 'intermediate',
    tags: ['generics', 'constraints', 'extends', 'keyof'],
    preview: 'T extends { length: number }',
    whyRelevant2026: 'Constraints позволяют писать type-safe API. Широко используются в библиотеках (React Query, Zod, tRPC).',
    related: ['generic-function', 'keyof-typeof'],
  },
  {
    id: 'generic-interface',
    title: 'Generic Interface',
    description: 'Generic интерфейсы для типизации структур данных. Основа для API-ответов, коллекций и контейнеров.',
    code: `// Generic интерфейс для API ответа
interface ApiResponse<T> {
  data: T
  status: number
  message: string
  timestamp: Date
}

interface User {
  id: number
  name: string
}

// Использование
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'Alice' },
  status: 200,
  message: 'Success',
  timestamp: new Date(),
}

// Generic для пагинации
interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrev: boolean
}

async function fetchUsers(): Promise<PaginatedResponse<User>> {
  // fetch logic
}

// Generic для формы
interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

interface LoginForm {
  email: string
  password: string
}

const loginState: FormState<LoginForm> = {
  values: { email: '', password: '' },
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: false,
}

// Generic с default типом
interface Container<T = string> {
  value: T
  getValue(): T
}

const stringContainer: Container = { value: 'hello', getValue: () => 'hello' }
const numberContainer: Container<number> = { value: 42, getValue: () => 42 }`,
    language: 'ts',
    level: 'intermediate',
    tags: ['generics', 'interface', 'api', 'forms', 'data-structures'],
    preview: 'interface ApiResponse<T>',
    whyRelevant2026: 'Стандарт для типизации API. Все современные data-fetching библиотеки (TanStack Query, SWR) используют этот паттерн.',
    related: ['generic-function', 'generic-class'],
  },
  {
    id: 'generic-class',
    title: 'Generic Class',
    description: 'Generic классы для создания типобезопасных контейнеров, коллекций и сервисов.',
    code: `// Generic класс — типобезопасный стек
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  get size(): number {
    return this.items.length
  }
}

const numberStack = new Stack<number>()
numberStack.push(1)
numberStack.push(2)
const top = numberStack.pop() // number | undefined

// Generic Repository паттерн
interface Entity {
  id: string
}

class Repository<T extends Entity> {
  private items = new Map<string, T>()

  save(item: T): void {
    this.items.set(item.id, item)
  }

  findById(id: string): T | undefined {
    return this.items.get(id)
  }

  findAll(): T[] {
    return Array.from(this.items.values())
  }

  delete(id: string): boolean {
    return this.items.delete(id)
  }
}

interface User extends Entity {
  name: string
  email: string
}

const userRepo = new Repository<User>()
userRepo.save({ id: '1', name: 'Alice', email: 'alice@mail.com' })

// Generic с несколькими параметрами
class KeyValueStore<K, V> {
  private store = new Map<K, V>()

  set(key: K, value: V): void {
    this.store.set(key, value)
  }

  get(key: K): V | undefined {
    return this.store.get(key)
  }
}

const cache = new KeyValueStore<string, User>()`,
    language: 'ts',
    level: 'intermediate',
    tags: ['generics', 'class', 'oop', 'data-structures', 'repository'],
    preview: 'class Stack<T>',
    whyRelevant2026: 'Generic классы используются в DI-контейнерах, ORM (Prisma), и state management. Паттерн Repository актуален для server-side.',
    related: ['generic-interface', 'generic-constraints'],
  },
  {
    id: 'mapped-types',
    title: 'Mapped Types',
    description: 'Создание новых типов на основе существующих через итерацию по ключам. Основа utility types.',
    code: `// Базовый mapped type
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

type Optional<T> = {
  [K in keyof T]?: T[K]
}

interface User {
  id: number
  name: string
  email: string
}

type ReadonlyUser = Readonly<User>
// { readonly id: number; readonly name: string; readonly email: string }

// Mapped type с модификаторами
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type Required<T> = {
  [K in keyof T]-?: T[K]
}

// Переименование ключей
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

type UserGetters = Getters<User>
// { getId: () => number; getName: () => string; getEmail: () => string }

// Фильтрация ключей
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}

interface Mixed {
  name: string
  age: number
  email: string
}

type StringFields = OnlyStrings<Mixed>
// { name: string; email: string }

// Практический пример: EventMap
type EventMap<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}\`]: (value: T[K]) => void
}

interface State {
  count: number
  user: User | null
}

type StateEvents = EventMap<State>
// { onCount: (value: number) => void; onUser: (value: User | null) => void }`,
    language: 'ts',
    level: 'advanced',
    tags: ['generics', 'mapped-types', 'utility-types', 'keyof', 'as'],
    preview: '[K in keyof T]: T[K]',
    whyRelevant2026: 'Mapped types — сердце TypeScript метапрограммирования. Используются в form libraries, ORM, API clients.',
    related: ['conditional-types', 'template-literal-types'],
  },
  {
    id: 'conditional-types',
    title: 'Conditional Types',
    description: 'Условные типы для создания типов на основе условий. Позволяют реализовать сложную логику на уровне типов.',
    code: `// Базовый conditional type
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false

// Извлечение типа из Promise
type Awaited<T> = T extends Promise<infer U> ? U : T

type A = Awaited<Promise<string>>  // string
type B = Awaited<string>           // string

// Извлечение типа элемента массива
type ArrayElement<T> = T extends (infer U)[] ? U : never

type A = ArrayElement<string[]>  // string
type B = ArrayElement<number>    // never

// Извлечение return type функции
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function getUser() {
  return { id: 1, name: 'Alice' }
}

type UserType = ReturnType<typeof getUser>
// { id: number; name: string }

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never

type A = ToArray<string | number>  // string[] | number[]

// Exclude распределяется по union
type Exclude<T, U> = T extends U ? never : T

type A = Exclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'

// Практический пример: типизация API endpoints
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type RequestBody<M extends HttpMethod> =
  M extends 'GET' | 'DELETE' ? never : Record<string, unknown>

type GetRequest = RequestBody<'GET'>     // never
type PostRequest = RequestBody<'POST'>   // Record<string, unknown>

// Рекурсивный conditional type
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T`,
    language: 'ts',
    level: 'advanced',
    tags: ['generics', 'conditional-types', 'infer', 'utility-types'],
    preview: 'T extends U ? X : Y',
    whyRelevant2026: 'Conditional types позволяют создавать умные API. Используются в tRPC, Zod, и других type-safe библиотеках.',
    related: ['mapped-types', 'infer-keyword'],
  },
  {
    id: 'infer-keyword',
    title: 'Infer Keyword',
    description: 'Ключевое слово infer для извлечения типов внутри conditional types. Мощный инструмент для type inference.',
    code: `// infer извлекает тип из структуры
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// Извлечение типа первого аргумента
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never

function greet(name: string, age: number) {
  return \`Hello \${name}\`
}

type Name = FirstArg<typeof greet>  // string

// Извлечение всех аргументов
type Parameters<T> = T extends (...args: infer P) => any ? P : never

type GreetParams = Parameters<typeof greet>  // [string, number]

// Извлечение типа из Promise
type UnwrapPromise<T> = T extends Promise<infer U>
  ? U extends Promise<any>
    ? UnwrapPromise<U>  // рекурсивно разворачиваем
    : U
  : T

type A = UnwrapPromise<Promise<Promise<string>>>  // string

// Извлечение типа props из React компонента
type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never

// Извлечение типа из массива
type Flatten<T> = T extends (infer U)[] ? Flatten<U> : T

type A = Flatten<number[][][]>  // number

// Практический пример: извлечение типа из API route
type ApiRoute<T> = T extends {
  params: infer P
  response: infer R
} ? { params: P; response: R } : never

const userRoute = {
  params: { id: '' as string },
  response: { name: '', email: '' },
}

type UserRouteTypes = ApiRoute<typeof userRoute>
// { params: { id: string }; response: { name: string; email: string } }

// Извлечение generic параметра
type GetGenericParam<T> = T extends Array<infer U> ? U :
                          T extends Set<infer U> ? U :
                          T extends Map<any, infer U> ? U : never`,
    language: 'ts',
    level: 'advanced',
    tags: ['generics', 'infer', 'conditional-types', 'type-extraction'],
    preview: 'T extends (...args: infer P) => infer R',
    whyRelevant2026: 'infer — ключ к type-safe библиотекам. Позволяет извлекать типы из runtime значений без дублирования.',
    related: ['conditional-types', 'template-literal-types'],
  },
  {
    id: 'template-literal-types',
    title: 'Template Literal Types',
    description: 'Шаблонные литеральные типы для создания строковых типов на основе других типов.',
    code: `// Базовый template literal type
type Greeting = \`Hello, \${string}\`

const a: Greeting = 'Hello, World'  // ✅
const b: Greeting = 'Hi, World'     // ❌

// Комбинация с union types
type Color = 'red' | 'green' | 'blue'
type Size = 'sm' | 'md' | 'lg'

type ColorSize = \`\${Color}-\${Size}\`
// 'red-sm' | 'red-md' | 'red-lg' | 'green-sm' | ...

// CSS-like типы
type CSSUnit = 'px' | 'em' | 'rem' | '%'
type CSSValue = \`\${number}\${CSSUnit}\`

const width: CSSValue = '100px'   // ✅
const height: CSSValue = '50%'    // ✅

// Event handlers
type EventName = 'click' | 'focus' | 'blur'
type Handler = \`on\${Capitalize<EventName>}\`
// 'onClick' | 'onFocus' | 'onBlur'

// HTTP routes
type Method = 'get' | 'post' | 'put' | 'delete'
type Route = '/users' | '/posts' | '/comments'
type Endpoint = \`\${Uppercase<Method>} \${Route}\`
// 'GET /users' | 'GET /posts' | 'POST /users' | ...

// Практический пример: типизация путей объекта
type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? K | \`\${K}.\${PathImpl<T[K], keyof T[K]>}\`
    : K
  : never

type Path<T> = PathImpl<T, keyof T>

interface Config {
  server: {
    host: string
    port: number
  }
  db: {
    url: string
  }
}

type ConfigPath = Path<Config>
// 'server' | 'server.host' | 'server.port' | 'db' | 'db.url'

// Intrinsic string manipulation
type Upper = Uppercase<'hello'>      // 'HELLO'
type Lower = Lowercase<'HELLO'>      // 'hello'
type Cap = Capitalize<'hello'>       // 'Hello'
type Uncap = Uncapitalize<'Hello'>   // 'hello'`,
    language: 'ts',
    level: 'advanced',
    tags: ['generics', 'template-literal', 'string-types', 'utility-types'],
    preview: '`${Color}-${Size}`',
    whyRelevant2026: 'Template literals обеспечивают type-safe routing, CSS-in-JS, и i18n. Широко используются в Next.js App Router.',
    related: ['mapped-types', 'conditional-types'],
  },
  {
    id: 'generic-defaults',
    title: 'Generic Defaults',
    description: 'Значения по умолчанию для generic параметров. Упрощают использование generic типов.',
    code: `// Generic с default значением
interface ApiResponse<T = unknown, E = Error> {
  data: T | null
  error: E | null
  loading: boolean
}

// Можно использовать без указания типа
const response: ApiResponse = {
  data: null,
  error: null,
  loading: true,
}

// Или с конкретным типом
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'Alice' },
  error: null,
  loading: false,
}

// Функция с default generic
function createState<T = string>(initial: T): { value: T; set: (v: T) => void } {
  let value = initial
  return {
    value,
    set: (v) => { value = v },
  }
}

const stringState = createState('hello')  // T = string (из аргумента)
const numberState = createState(42)       // T = number
const defaultState = createState<boolean>(true)  // явно указано

// Класс с default generics
class Store<T = Record<string, unknown>, A = { type: string }> {
  private state: T

  constructor(initialState: T) {
    this.state = initialState
  }

  dispatch(action: A): void {
    // handle action
  }
}

const simpleStore = new Store({ count: 0 })

// React компонент с defaults
interface Props<T = string> {
  value: T
  onChange: (value: T) => void
  options?: T[]
}

function Select<T = string>({ value, onChange, options }: Props<T>) {
  // ...
}

// Использование
<Select value="a" onChange={(v) => console.log(v)} />  // T = string
<Select<number> value={1} onChange={(v) => console.log(v)} />`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['generics', 'defaults', 'type-inference', 'react'],
    preview: 'interface Response<T = unknown>',
    whyRelevant2026: 'Default generics улучшают DX. Позволяют создавать гибкие API без принуждения указывать типы.',
    related: ['generic-interface', 'generic-constraints'],
  },
  {
    id: 'variadic-tuple-types',
    title: 'Variadic Tuple Types',
    description: 'Вариативные tuple типы для работы с функциями переменной арности и композицией.',
    code: `// Spread в tuple types
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]

type A = Concat<[1, 2], [3, 4]>  // [1, 2, 3, 4]

// Добавление элемента в начало/конец
type Push<T extends unknown[], U> = [...T, U]
type Unshift<T extends unknown[], U> = [U, ...T]

type A = Push<[1, 2], 3>      // [1, 2, 3]
type B = Unshift<[2, 3], 1>   // [1, 2, 3]

// Типизация функции pipe
type PipeArgs<F extends ((...args: any) => any)[]> = F extends [
  (...args: infer A) => any,
  ...any[]
] ? A : never

type PipeReturn<F extends ((...args: any) => any)[]> = F extends [
  ...any[],
  (...args: any) => infer R
] ? R : never

function pipe<F extends ((...args: any) => any)[]>(
  ...fns: F
): (...args: PipeArgs<F>) => PipeReturn<F> {
  return (...args) => fns.reduce((acc, fn) => fn(acc), args[0])
}

const transform = pipe(
  (x: number) => x * 2,
  (x: number) => x.toString(),
  (x: string) => x.length
)
// (x: number) => number

// Практический пример: typed EventEmitter
type EventConfig = {
  click: [x: number, y: number]
  change: [value: string]
  submit: []
}

class TypedEmitter<E extends Record<string, unknown[]>> {
  on<K extends keyof E>(event: K, handler: (...args: E[K]) => void): void {
    // ...
  }

  emit<K extends keyof E>(event: K, ...args: E[K]): void {
    // ...
  }
}

const emitter = new TypedEmitter<EventConfig>()
emitter.on('click', (x, y) => console.log(x, y))  // x: number, y: number
emitter.emit('click', 10, 20)  // ✅
emitter.emit('click', 'a')     // ❌ type error`,
    language: 'ts',
    level: 'advanced',
    tags: ['generics', 'tuples', 'variadic', 'functions', 'events'],
    preview: 'type Concat<T, U> = [...T, ...U]',
    whyRelevant2026: 'Variadic tuples необходимы для type-safe compose, pipe, и event systems. Используются в функциональных библиотеках.',
    related: ['generic-function', 'conditional-types'],
  },
]
