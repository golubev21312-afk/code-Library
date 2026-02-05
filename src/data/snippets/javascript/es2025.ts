import type { Snippet } from '@/types'

export const es2025Snippets: Snippet[] = [
  {
    id: 'array-at',
    title: 'Array.at()',
    description: 'Метод at() для доступа к элементам массива по индексу, включая отрицательные индексы.',
    code: `// Array.at() — доступ по индексу с поддержкой отрицательных
const arr = ['a', 'b', 'c', 'd', 'e']

// Положительные индексы (как обычно)
arr.at(0)   // 'a'
arr.at(2)   // 'c'

// Отрицательные индексы — с конца
arr.at(-1)  // 'e' (последний)
arr.at(-2)  // 'd' (предпоследний)

// Сравнение со старым способом
const last = arr[arr.length - 1]  // старый способ
const lastNew = arr.at(-1)        // новый способ

// Работает и со строками
const str = 'Hello'
str.at(-1)  // 'o'

// Практический пример: получение последнего элемента
function getLastItem<T>(items: T[]): T | undefined {
  return items.at(-1)
}

const users = [{ name: 'Alice' }, { name: 'Bob' }]
const lastUser = getLastItem(users)  // { name: 'Bob' }

// Безопасная работа с пустыми массивами
const empty: string[] = []
empty.at(-1)  // undefined (не выбросит ошибку)

// Работает с TypedArray
const typed = new Uint8Array([1, 2, 3, 4, 5])
typed.at(-1)  // 5`,
    language: 'js',
    level: 'beginner',
    tags: ['array', 'es2022', 'methods', 'indexing'],
    preview: 'arr.at(-1)',
    whyRelevant2026: 'at() — стандарт для доступа к элементам. Поддерживается всеми браузерами и Node.js 16.6+.',
    related: ['array-findlast', 'array-toreversed'],
  },
  {
    id: 'array-findlast',
    title: 'Array.findLast()',
    description: 'Методы findLast() и findLastIndex() для поиска с конца массива.',
    code: `// findLast() — поиск с конца массива
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]

// find() находит первый элемент
numbers.find(n => n > 3)      // 4 (индекс 3)

// findLast() находит последний элемент
numbers.findLast(n => n > 3)  // 4 (индекс 5)

// findLastIndex() — индекс последнего совпадения
numbers.findLastIndex(n => n > 3)  // 5

// Практический пример: последняя активная сессия
const sessions = [
  { id: 1, active: true, time: '10:00' },
  { id: 2, active: false, time: '11:00' },
  { id: 3, active: true, time: '12:00' },
  { id: 4, active: false, time: '13:00' },
]

const lastActive = sessions.findLast(s => s.active)
// { id: 3, active: true, time: '12:00' }

// Поиск последней ошибки в логах
const logs = [
  { level: 'info', message: 'Started' },
  { level: 'error', message: 'Failed to connect' },
  { level: 'info', message: 'Retrying' },
  { level: 'error', message: 'Connection timeout' },
  { level: 'info', message: 'Connected' },
]

const lastError = logs.findLast(log => log.level === 'error')
// { level: 'error', message: 'Connection timeout' }

// TypeScript типизация
interface User {
  id: number
  name: string
  role: 'admin' | 'user'
}

const users: User[] = [
  { id: 1, name: 'Alice', role: 'user' },
  { id: 2, name: 'Bob', role: 'admin' },
  { id: 3, name: 'Charlie', role: 'admin' },
]

const lastAdmin = users.findLast(u => u.role === 'admin')
// User | undefined`,
    language: 'ts',
    level: 'beginner',
    tags: ['array', 'es2023', 'search', 'methods'],
    preview: 'arr.findLast(fn)',
    whyRelevant2026: 'findLast() избавляет от reverse().find(). ES2023 фича, поддержка в Node.js 18+ и современных браузерах.',
    related: ['array-at', 'array-toreversed'],
  },
  {
    id: 'array-toreversed',
    title: 'Immutable Array Methods',
    description: 'Иммутабельные методы массивов: toReversed(), toSorted(), toSpliced(), with().',
    code: `// toReversed() — reverse без мутации
const arr = [1, 2, 3, 4, 5]

const reversed = arr.toReversed()
// reversed: [5, 4, 3, 2, 1]
// arr: [1, 2, 3, 4, 5] — не изменился!

// toSorted() — sort без мутации
const numbers = [3, 1, 4, 1, 5, 9, 2, 6]

const sorted = numbers.toSorted((a, b) => a - b)
// sorted: [1, 1, 2, 3, 4, 5, 6, 9]
// numbers: [3, 1, 4, 1, 5, 9, 2, 6] — не изменился!

// toSpliced() — splice без мутации
const months = ['Jan', 'Feb', 'Apr', 'May']

const fixed = months.toSpliced(2, 0, 'Mar')
// fixed: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
// months: ['Jan', 'Feb', 'Apr', 'May'] — не изменился!

// with() — замена элемента по индексу без мутации
const colors = ['red', 'green', 'blue']

const updated = colors.with(1, 'yellow')
// updated: ['red', 'yellow', 'blue']
// colors: ['red', 'green', 'blue'] — не изменился!

// Поддержка отрицательных индексов
const last = colors.with(-1, 'purple')
// ['red', 'green', 'purple']

// Практический пример: React state update
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn JS', done: false },
    { id: 2, text: 'Learn React', done: false },
  ])

  const toggleTodo = (index: number) => {
    setTodos(prev => prev.with(index, {
      ...prev[index],
      done: !prev[index].done,
    }))
  }

  const sortByText = () => {
    setTodos(prev => prev.toSorted((a, b) =>
      a.text.localeCompare(b.text)
    ))
  }

  const removeTodo = (index: number) => {
    setTodos(prev => prev.toSpliced(index, 1))
  }
}`,
    language: 'tsx',
    level: 'intermediate',
    tags: ['array', 'es2023', 'immutable', 'react'],
    preview: 'arr.toSorted(), arr.with()',
    whyRelevant2026: 'Immutable methods — стандарт для React/Redux. Не нужен spread operator или immer для простых операций.',
    related: ['array-findlast', 'spread-operator'],
  },
  {
    id: 'object-groupby',
    title: 'Object.groupBy()',
    description: 'Группировка элементов массива по ключу. Замена для lodash.groupBy.',
    code: `// Object.groupBy() — группировка элементов
const products = [
  { name: 'Apple', category: 'fruit', price: 1.5 },
  { name: 'Banana', category: 'fruit', price: 0.5 },
  { name: 'Carrot', category: 'vegetable', price: 0.8 },
  { name: 'Broccoli', category: 'vegetable', price: 1.2 },
]

// Группировка по категории
const byCategory = Object.groupBy(products, p => p.category)
// {
//   fruit: [{ name: 'Apple', ... }, { name: 'Banana', ... }],
//   vegetable: [{ name: 'Carrot', ... }, { name: 'Broccoli', ... }]
// }

// Map.groupBy() — возвращает Map вместо Object
const byPrice = Map.groupBy(products, p =>
  p.price > 1 ? 'expensive' : 'cheap'
)
// Map { 'expensive' => [...], 'cheap' => [...] }

// Практический пример: группировка пользователей
const users = [
  { name: 'Alice', role: 'admin', active: true },
  { name: 'Bob', role: 'user', active: false },
  { name: 'Charlie', role: 'user', active: true },
  { name: 'Diana', role: 'admin', active: true },
]

// По роли
const byRole = Object.groupBy(users, u => u.role)

// По статусу активности
const byStatus = Object.groupBy(users, u =>
  u.active ? 'active' : 'inactive'
)

// Группировка по нескольким критериям
const byRoleAndStatus = Object.groupBy(users, u =>
  \`\${u.role}-\${u.active ? 'active' : 'inactive'}\`
)

// TypeScript типизация
interface Product {
  name: string
  category: string
}

const grouped: Partial<Record<string, Product[]>> =
  Object.groupBy(products, p => p.category)

// Полифилл для старых браузеров
if (!Object.groupBy) {
  Object.groupBy = function<T>(arr: T[], fn: (item: T) => string) {
    return arr.reduce((acc, item) => {
      const key = fn(item)
      ;(acc[key] ??= []).push(item)
      return acc
    }, {} as Record<string, T[]>)
  }
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['object', 'es2024', 'grouping', 'array'],
    preview: 'Object.groupBy(arr, fn)',
    whyRelevant2026: 'Object.groupBy() — нативная замена lodash.groupBy. ES2024, поддержка расширяется. Используй полифилл для старых браузеров.',
    related: ['array-reduce', 'map-methods'],
  },
  {
    id: 'promise-withresolvers',
    title: 'Promise.withResolvers()',
    description: 'Создание Promise с внешним доступом к resolve и reject. Удобно для event-based кода.',
    code: `// Promise.withResolvers() — деструктуризация промиса
const { promise, resolve, reject } = Promise.withResolvers<string>()

// Теперь можно resolve/reject извне
setTimeout(() => resolve('Done!'), 1000)

const result = await promise  // 'Done!'

// Старый способ (менее удобный)
let resolveOld: (value: string) => void
let rejectOld: (reason: unknown) => void

const promiseOld = new Promise<string>((res, rej) => {
  resolveOld = res
  rejectOld = rej
})

// Практический пример: ожидание события
function waitForEvent<T>(target: EventTarget, event: string): Promise<T> {
  const { promise, resolve } = Promise.withResolvers<T>()

  target.addEventListener(event, (e) => {
    resolve(e as T)
  }, { once: true })

  return promise
}

// Использование
const button = document.querySelector('button')!
const clickEvent = await waitForEvent<MouseEvent>(button, 'click')
console.log('Clicked at:', clickEvent.clientX, clickEvent.clientY)

// Deferred pattern
function createDeferred<T>() {
  const { promise, resolve, reject } = Promise.withResolvers<T>()

  return {
    promise,
    resolve,
    reject,
    // Дополнительные методы
    resolveWith: (fn: () => T | Promise<T>) => {
      Promise.resolve().then(fn).then(resolve).catch(reject)
    },
  }
}

// Таймаут с отменой
function createCancellableTimeout(ms: number) {
  const { promise, resolve, reject } = Promise.withResolvers<void>()

  const timeoutId = setTimeout(resolve, ms)

  return {
    promise,
    cancel: () => {
      clearTimeout(timeoutId)
      reject(new Error('Cancelled'))
    },
  }
}

const { promise: timeout, cancel } = createCancellableTimeout(5000)

// Отменить через 2 секунды
setTimeout(cancel, 2000)`,
    language: 'ts',
    level: 'intermediate',
    tags: ['promise', 'es2024', 'async', 'events'],
    preview: 'Promise.withResolvers()',
    whyRelevant2026: 'withResolvers() упрощает deferred pattern. ES2024, уже в Chrome 119+, Firefox 121+, Safari 17.4+.',
    related: ['promise-all', 'async-await'],
  },
  {
    id: 'nullish-coalescing',
    title: 'Nullish Coalescing & Assignment',
    description: 'Операторы ?? и ??= для работы с null и undefined.',
    code: `// ?? — nullish coalescing (только null/undefined)
const value1 = null ?? 'default'      // 'default'
const value2 = undefined ?? 'default' // 'default'
const value3 = 0 ?? 'default'         // 0 (не null/undefined!)
const value4 = '' ?? 'default'        // '' (не null/undefined!)
const value5 = false ?? 'default'     // false

// Сравнение с || (logical OR)
const or1 = 0 || 'default'     // 'default' (0 — falsy)
const or2 = '' || 'default'    // 'default' ('' — falsy)
const null1 = 0 ?? 'default'   // 0
const null2 = '' ?? 'default'  // ''

// ??= — nullish assignment
let config: { timeout?: number } = {}

config.timeout ??= 5000  // Присвоить только если null/undefined
// config.timeout = 5000

config.timeout ??= 3000  // Не изменится, т.к. уже есть значение
// config.timeout = 5000

// Практический пример: параметры функции
interface Options {
  retries?: number
  timeout?: number
  debug?: boolean
}

function fetchData(url: string, options: Options = {}) {
  // Используем ?? для default values
  const retries = options.retries ?? 3
  const timeout = options.timeout ?? 5000
  const debug = options.debug ?? false

  // retries может быть 0, и это валидное значение
  // С || было бы: 0 || 3 = 3 (неправильно!)
}

// Цепочка ??
const a = null
const b = undefined
const c = 'value'

const result = a ?? b ?? c  // 'value'

// С optional chaining
interface User {
  settings?: {
    theme?: string
  }
}

const user: User = {}
const theme = user.settings?.theme ?? 'light'`,
    language: 'ts',
    level: 'beginner',
    tags: ['nullish', 'operators', 'es2020', 'defaults'],
    preview: 'value ?? default',
    whyRelevant2026: '?? — стандарт для default values в современном JS. Безопаснее чем || для 0, "" и false.',
    related: ['optional-chaining', 'logical-assignment'],
  },
  {
    id: 'optional-chaining',
    title: 'Optional Chaining',
    description: 'Оператор ?. для безопасного доступа к вложенным свойствам.',
    code: `// ?. — optional chaining
const user = {
  name: 'Alice',
  address: {
    city: 'Moscow',
  },
}

// Безопасный доступ к свойствам
const city = user.address?.city  // 'Moscow'
const zip = user.address?.zip    // undefined (не ошибка!)

// Без optional chaining (старый способ)
const cityOld = user.address && user.address.city

// Глубокая вложенность
const config = {
  db: {
    connection: {
      host: 'localhost',
    },
  },
}

const host = config.db?.connection?.host  // 'localhost'
const port = config.db?.connection?.port  // undefined

// Optional chaining с методами
const obj = {
  getData: () => 'data',
}

obj.getData?.()    // 'data'
obj.notExist?.()   // undefined (не вызовет ошибку)

// С массивами
const users = [{ name: 'Alice' }, { name: 'Bob' }]

users[0]?.name   // 'Alice'
users[10]?.name  // undefined

// Практический пример: API response
interface ApiResponse {
  data?: {
    user?: {
      profile?: {
        avatar?: string
      }
    }
  }
}

const response: ApiResponse = {}

const avatar = response.data?.user?.profile?.avatar ?? '/default.png'

// Optional chaining с delete
delete user.address?.zip  // Безопасно, даже если zip нет

// Комбинация с nullish coalescing
const theme = user.settings?.theme ?? 'light'
const fontSize = user.settings?.fontSize ?? 16

// В функциях
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce(
    (current, key) => current?.[key],
    obj
  )
}`,
    language: 'ts',
    level: 'beginner',
    tags: ['optional-chaining', 'operators', 'es2020', 'safety'],
    preview: 'obj?.prop?.nested',
    whyRelevant2026: 'Optional chaining — must-have для работы с API и вложенными данными. Заменяет громоздкие проверки.',
    related: ['nullish-coalescing', 'type-guards'],
  },
  {
    id: 'logical-assignment',
    title: 'Logical Assignment',
    description: 'Операторы ||=, &&=, ??= для условного присваивания.',
    code: `// ||= — присвоить если falsy
let a = 0
a ||= 10  // a = 10 (0 — falsy)

let b = 'hello'
b ||= 'default'  // b = 'hello' (не изменится)

// &&= — присвоить если truthy
let c = 'value'
c &&= 'updated'  // c = 'updated'

let d = null
d &&= 'updated'  // d = null (не изменится)

// ??= — присвоить если null/undefined
let e = 0
e ??= 10  // e = 0 (0 — не null/undefined!)

let f = null
f ??= 'default'  // f = 'default'

// Практический пример: lazy initialization
class Cache {
  private data: Map<string, unknown> | null = null

  private getStore() {
    // Создаём Map только при первом обращении
    return this.data ??= new Map()
  }

  get(key: string) {
    return this.getStore().get(key)
  }

  set(key: string, value: unknown) {
    this.getStore().set(key, value)
  }
}

// Default values в объектах
const options: Record<string, number> = {}

options.timeout ??= 5000
options.retries ??= 3
options.delay ??= 100

// Условное обновление
interface User {
  name: string
  email?: string
  verified?: boolean
}

function updateUser(user: User, updates: Partial<User>) {
  // Обновить только если есть новое значение
  user.email &&= updates.email ?? user.email
  user.verified ??= false
}

// Счётчики и аккумуляторы
const counts: Record<string, number> = {}

function increment(key: string) {
  counts[key] ??= 0
  counts[key]++
}

increment('views')  // counts.views = 1
increment('views')  // counts.views = 2`,
    language: 'ts',
    level: 'intermediate',
    tags: ['logical-assignment', 'operators', 'es2021'],
    preview: 'value ??= default',
    whyRelevant2026: 'Logical assignment сокращает код инициализации. ES2021, полная поддержка во всех современных средах.',
    related: ['nullish-coalescing', 'optional-chaining'],
  },
  {
    id: 'string-replaceall',
    title: 'String.replaceAll()',
    description: 'Метод replaceAll() для замены всех вхождений подстроки.',
    code: `// replaceAll() — замена всех вхождений
const text = 'hello world, hello universe'

// Старый способ с RegExp и флагом g
const oldWay = text.replace(/hello/g, 'hi')
// 'hi world, hi universe'

// Новый способ
const newWay = text.replaceAll('hello', 'hi')
// 'hi world, hi universe'

// replace() заменяет только первое вхождение
const first = text.replace('hello', 'hi')
// 'hi world, hello universe'

// С регулярными выражениями (нужен флаг g)
const withRegex = text.replaceAll(/hello/g, 'hi')

// Практические примеры
const template = 'Hello, {{name}}! Welcome to {{city}}.'

const filled = template
  .replaceAll('{{name}}', 'Alice')
  .replaceAll('{{city}}', 'Moscow')
// 'Hello, Alice! Welcome to Moscow.'

// Очистка данных
const dirty = 'price: $100, discount: $20'
const clean = dirty.replaceAll('$', '')
// 'price: 100, discount: 20'

// Нормализация пробелов
const messy = 'too    many   spaces'
const normalized = messy.replaceAll(/\s+/g, ' ')
// 'too many spaces'

// URL slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll(/[^a-z0-9-]/g, '')
}

slugify('Hello World!')  // 'hello-world'

// Escape HTML
function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}`,
    language: 'ts',
    level: 'beginner',
    tags: ['string', 'es2021', 'methods', 'replace'],
    preview: "str.replaceAll('a', 'b')",
    whyRelevant2026: 'replaceAll() — чище чем replace с /g флагом. ES2021, полная поддержка. Используй для строковых трансформаций.',
    related: ['template-literals', 'string-methods'],
  },
  {
    id: 'structuredclone',
    title: 'structuredClone()',
    description: 'Глубокое клонирование объектов без JSON.parse(JSON.stringify()).',
    code: `// structuredClone() — глубокое клонирование
const original = {
  name: 'Alice',
  date: new Date(),
  nested: {
    array: [1, 2, 3],
    map: new Map([['key', 'value']]),
    set: new Set([1, 2, 3]),
  },
}

const clone = structuredClone(original)

// Изменения в clone не влияют на original
clone.nested.array.push(4)
console.log(original.nested.array)  // [1, 2, 3]
console.log(clone.nested.array)     // [1, 2, 3, 4]

// Сохраняет типы!
clone.date instanceof Date  // true
clone.nested.map instanceof Map  // true
clone.nested.set instanceof Set  // true

// JSON.parse/stringify теряет типы
const jsonClone = JSON.parse(JSON.stringify(original))
jsonClone.date instanceof Date  // false (это строка!)
jsonClone.nested.map  // {} (Map потерян!)

// Поддерживаемые типы
const supported = {
  date: new Date(),
  regexp: /pattern/gi,
  map: new Map(),
  set: new Set(),
  arrayBuffer: new ArrayBuffer(8),
  typedArray: new Uint8Array([1, 2, 3]),
  blob: new Blob(['data']),
  // И многие другие...
}

const cloned = structuredClone(supported)  // Всё работает!

// НЕ поддерживаются
const notSupported = {
  function: () => {},       // ❌ Error
  symbol: Symbol('test'),   // ❌ Error
  dom: document.body,       // ❌ Error
}

// structuredClone(notSupported)  // Выбросит ошибку

// Практический пример: immutable state update
function updateState<T extends object>(state: T, updates: Partial<T>): T {
  const newState = structuredClone(state)
  return Object.assign(newState, updates)
}

// Клонирование с трансформацией
function cloneAndTransform<T>(obj: T, transform: (clone: T) => void): T {
  const clone = structuredClone(obj)
  transform(clone)
  return clone
}

const user = { name: 'Alice', age: 30 }
const older = cloneAndTransform(user, u => { u.age++ })
// { name: 'Alice', age: 31 }`,
    language: 'ts',
    level: 'intermediate',
    tags: ['clone', 'deep-copy', 'es2022', 'objects'],
    preview: 'structuredClone(obj)',
    whyRelevant2026: 'structuredClone() — нативная глубокая копия. Быстрее и надёжнее чем JSON hack или lodash.cloneDeep.',
    related: ['spread-operator', 'object-assign'],
  },
  {
    id: 'private-fields',
    title: 'Private Class Fields',
    description: 'Приватные поля классов через # синтаксис. Истинная инкапсуляция.',
    code: `// # — приватные поля класса
class BankAccount {
  // Приватные поля (недоступны извне)
  #balance = 0
  #pin: string

  // Публичное поле
  owner: string

  constructor(owner: string, pin: string, initialBalance = 0) {
    this.owner = owner
    this.#pin = pin
    this.#balance = initialBalance
  }

  // Приватный метод
  #validatePin(pin: string): boolean {
    return this.#pin === pin
  }

  deposit(amount: number): void {
    if (amount > 0) {
      this.#balance += amount
    }
  }

  withdraw(amount: number, pin: string): boolean {
    if (!this.#validatePin(pin)) {
      throw new Error('Invalid PIN')
    }

    if (amount > this.#balance) {
      return false
    }

    this.#balance -= amount
    return true
  }

  getBalance(pin: string): number {
    if (!this.#validatePin(pin)) {
      throw new Error('Invalid PIN')
    }
    return this.#balance
  }
}

const account = new BankAccount('Alice', '1234', 1000)

account.owner           // 'Alice' ✅
// account.#balance     // ❌ SyntaxError: Private field
// account.#pin         // ❌ SyntaxError: Private field

account.deposit(500)
account.getBalance('1234')  // 1500

// Статические приватные поля
class Config {
  static #instance: Config | null = null
  #settings = new Map<string, unknown>()

  private constructor() {}

  static getInstance(): Config {
    if (!Config.#instance) {
      Config.#instance = new Config()
    }
    return Config.#instance
  }

  set(key: string, value: unknown): void {
    this.#settings.set(key, value)
  }

  get(key: string): unknown {
    return this.#settings.get(key)
  }
}

// Проверка наличия приватного поля
class MyClass {
  #value = 42

  static hasValue(obj: unknown): obj is MyClass {
    return #value in obj
  }
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['class', 'private', 'es2022', 'encapsulation'],
    preview: '#privateField',
    whyRelevant2026: '# private fields — истинная приватность (не как TypeScript private). Runtime инкапсуляция.',
    related: ['class-static-blocks', 'decorators'],
  },
  {
    id: 'top-level-await',
    title: 'Top-Level Await',
    description: 'Использование await на верхнем уровне модуля без async обёртки.',
    code: `// Top-level await — await без async функции
// В ES модуле (.mjs или type: "module")

// Загрузка конфигурации
const response = await fetch('/api/config')
const config = await response.json()

export { config }

// Динамический импорт
const locale = navigator.language.slice(0, 2)
const messages = await import(\`./locales/\${locale}.js\`)

// Инициализация базы данных
import { createConnection } from './db.js'

const db = await createConnection({
  host: 'localhost',
  database: 'myapp',
})

export { db }

// Условная загрузка модуля
let analytics

if (process.env.NODE_ENV === 'production') {
  analytics = await import('./analytics.js')
} else {
  analytics = { track: () => {} }
}

export { analytics }

// Практический пример: lazy singleton
// database.ts
class Database {
  private constructor() {}

  static async create() {
    const instance = new Database()
    await instance.connect()
    return instance
  }

  private async connect() {
    // connection logic
  }
}

// Экспортируем уже подключенный instance
export const db = await Database.create()

// Использование в другом файле
import { db } from './database.js'
// db уже подключен и готов к использованию

// Fallback с try/catch
let cache

try {
  const redis = await import('redis')
  cache = await redis.createClient().connect()
} catch {
  // Fallback на in-memory cache
  cache = new Map()
}

export { cache }`,
    language: 'ts',
    level: 'intermediate',
    tags: ['async', 'modules', 'es2022', 'import'],
    preview: 'const data = await fetch(...)',
    whyRelevant2026: 'Top-level await упрощает инициализацию модулей. Стандарт для современных ES modules проектов.',
    related: ['dynamic-import', 'async-await'],
  },
  {
    id: 'error-cause',
    title: 'Error Cause',
    description: 'Свойство cause для цепочки ошибок. Сохраняет оригинальную ошибку.',
    code: `// Error cause — цепочка ошибок
async function fetchUser(id: string) {
  try {
    const response = await fetch(\`/api/users/\${id}\`)

    if (!response.ok) {
      throw new Error('HTTP error', {
        cause: { status: response.status, statusText: response.statusText }
      })
    }

    return await response.json()
  } catch (error) {
    // Оборачиваем с сохранением оригинальной ошибки
    throw new Error(\`Failed to fetch user \${id}\`, { cause: error })
  }
}

// Обработка с доступом к cause
try {
  await fetchUser('123')
} catch (error) {
  console.error('Error:', error.message)
  console.error('Cause:', error.cause)

  // Рекурсивный вывод всей цепочки
  let current = error
  while (current) {
    console.error('-', current.message)
    current = current.cause
  }
}

// Практический пример: сервисный слой
class UserService {
  async getUser(id: string) {
    try {
      return await this.repository.findById(id)
    } catch (error) {
      throw new Error('UserService.getUser failed', { cause: error })
    }
  }
}

class UserController {
  async handleGetUser(req: Request, res: Response) {
    try {
      const user = await this.userService.getUser(req.params.id)
      res.json(user)
    } catch (error) {
      // Логируем полную цепочку
      this.logger.error('Request failed', {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      })

      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

// Custom Error с cause
class ValidationError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause })
    this.name = 'ValidationError'
  }
}

class NetworkError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause })
    this.name = 'NetworkError'
  }
}

// Типизация cause
interface ErrorWithCause extends Error {
  cause?: unknown
}

function getErrorChain(error: ErrorWithCause): string[] {
  const chain: string[] = []
  let current: ErrorWithCause | undefined = error

  while (current) {
    chain.push(current.message)
    current = current.cause as ErrorWithCause | undefined
  }

  return chain
}`,
    language: 'ts',
    level: 'intermediate',
    tags: ['error', 'es2022', 'debugging', 'error-handling'],
    preview: 'new Error(msg, { cause })',
    whyRelevant2026: 'Error cause — стандарт для трассировки ошибок. Критично для debugging в микросервисах и сложных приложениях.',
    related: ['try-catch', 'custom-errors'],
  },
  {
    id: 'hashbang',
    title: 'Hashbang Grammar',
    description: 'Поддержка #! в начале файла для CLI скриптов.',
    code: `#!/usr/bin/env node
// hashbang.js — теперь это валидный JavaScript!

// Этот файл можно запустить напрямую:
// chmod +x hashbang.js
// ./hashbang.js

import { program } from 'commander'

program
  .name('my-cli')
  .version('1.0.0')
  .description('My awesome CLI tool')

program
  .command('greet <name>')
  .description('Greet someone')
  .option('-l, --loud', 'Greet loudly')
  .action((name, options) => {
    const greeting = \`Hello, \${name}!\`
    console.log(options.loud ? greeting.toUpperCase() : greeting)
  })

program.parse()

// TypeScript версия (hashbang.ts)
#!/usr/bin/env npx ts-node

console.log('Running TypeScript directly!')

// Пример CLI утилиты
#!/usr/bin/env node

const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'build':
    console.log('Building...')
    break
  case 'test':
    console.log('Testing...')
    break
  case 'deploy':
    console.log('Deploying...')
    break
  default:
    console.log('Usage: ./cli.js <build|test|deploy>')
}

// package.json bin field
// {
//   "bin": {
//     "my-cli": "./dist/cli.js"
//   }
// }

// После npm link:
// my-cli greet World
// my-cli greet World --loud`,
    language: 'js',
    level: 'intermediate',
    tags: ['cli', 'es2023', 'node', 'scripts'],
    preview: '#!/usr/bin/env node',
    whyRelevant2026: 'Hashbang официально в спецификации ES2023. Стандарт для Node.js CLI инструментов.',
    related: ['node-modules', 'cli-tools'],
  },
]
