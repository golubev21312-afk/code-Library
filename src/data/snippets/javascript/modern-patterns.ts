import type { Snippet } from '@/types'

export const modernPatterns: Snippet[] = [
  {
    id: 'js-proxy-reactive',
    title: 'Proxy для реактивности',
    description: 'Создание реактивных объектов с Proxy',
    code: `// Reactive system с Proxy
function reactive(target, onChange) {
  const handler = {
    get(obj, prop) {
      const value = obj[prop]
      // Рекурсивно делаем вложенные объекты реактивными
      if (value && typeof value === 'object') {
        return reactive(value, onChange)
      }
      return value
    },
    set(obj, prop, value) {
      const oldValue = obj[prop]
      obj[prop] = value
      if (oldValue !== value) {
        onChange(prop, value, oldValue)
      }
      return true
    },
    deleteProperty(obj, prop) {
      const oldValue = obj[prop]
      delete obj[prop]
      onChange(prop, undefined, oldValue)
      return true
    }
  }

  return new Proxy(target, handler)
}

// Использование
const state = reactive({ count: 0, user: { name: 'John' } }, (prop, newVal, oldVal) => {
  console.log(\`\${prop} changed from \${oldVal} to \${newVal}\`)
})

state.count = 1 // "count changed from 0 to 1"
state.user.name = 'Jane' // "name changed from John to Jane"

// Computed properties
function computed(getter, dependencies) {
  let cache = null
  let dirty = true

  dependencies.forEach(dep => {
    dep.subscribe(() => { dirty = true })
  })

  return {
    get value() {
      if (dirty) {
        cache = getter()
        dirty = false
      }
      return cache
    }
  }
}

// Signals-like pattern
function createSignal(initialValue) {
  let value = initialValue
  const subscribers = new Set()

  return [
    // Getter
    () => value,
    // Setter
    (newValue) => {
      value = typeof newValue === 'function' ? newValue(value) : newValue
      subscribers.forEach(fn => fn(value))
    },
    // Subscribe
    (fn) => {
      subscribers.add(fn)
      return () => subscribers.delete(fn)
    }
  ]
}

const [count, setCount, subscribe] = createSignal(0)
subscribe(v => console.log('Count:', v))
setCount(1) // "Count: 1"
setCount(prev => prev + 1) // "Count: 2"`,
    language: 'js',
    level: 'advanced',
    tags: ['javascript', 'proxy', 'reactive', 'signals'],
    whyRelevant2026: 'Signals паттерн используется в SolidJS, Preact и Angular',
    related: ['js-proxy-validation', 'js-observer-pattern']
  },
  {
    id: 'js-proxy-validation',
    title: 'Proxy для валидации',
    description: 'Валидация данных через Proxy',
    code: `// Schema-based validation с Proxy
function createValidatedObject(schema, target = {}) {
  const handler = {
    set(obj, prop, value) {
      const validator = schema[prop]

      if (!validator) {
        throw new Error(\`Unknown property: \${prop}\`)
      }

      const result = validator(value)
      if (result !== true) {
        throw new TypeError(\`Invalid \${prop}: \${result}\`)
      }

      obj[prop] = value
      return true
    }
  }

  return new Proxy(target, handler)
}

// Валидаторы
const isString = (v) => typeof v === 'string' || 'must be string'
const isNumber = (v) => typeof v === 'number' || 'must be number'
const isEmail = (v) => /^[^@]+@[^@]+$/.test(v) || 'must be valid email'
const minLength = (min) => (v) => v.length >= min || \`min length is \${min}\`
const range = (min, max) => (v) =>
  (v >= min && v <= max) || \`must be between \${min} and \${max}\`

// Комбинирование валидаторов
const and = (...validators) => (value) => {
  for (const v of validators) {
    const result = v(value)
    if (result !== true) return result
  }
  return true
}

// Схема
const userSchema = {
  name: and(isString, minLength(2)),
  email: and(isString, isEmail),
  age: and(isNumber, range(0, 150))
}

const user = createValidatedObject(userSchema)

user.name = 'John' // OK
user.email = 'john@example.com' // OK
user.age = 30 // OK

// user.age = 'thirty' // TypeError: Invalid age: must be number
// user.email = 'invalid' // TypeError: Invalid email: must be valid email

// Immutable wrapper
function immutable(target) {
  return new Proxy(target, {
    set() {
      throw new Error('Cannot modify immutable object')
    },
    deleteProperty() {
      throw new Error('Cannot delete from immutable object')
    }
  })
}

const config = immutable({ apiUrl: 'https://api.example.com' })
// config.apiUrl = 'new' // Error: Cannot modify immutable object`,
    language: 'js',
    level: 'intermediate',
    tags: ['javascript', 'proxy', 'validation', 'schema'],
    whyRelevant2026: 'Runtime validation остаётся важной для безопасности',
    related: ['js-proxy-reactive', 'ts-zod-validation']
  },
  {
    id: 'js-iterators-generators',
    title: 'Iterators и Generators',
    description: 'Кастомные итераторы и генераторы',
    code: `// Кастомный итератор
const range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    let current = this.from
    const last = this.to

    return {
      next() {
        if (current <= last) {
          return { done: false, value: current++ }
        }
        return { done: true }
      }
    }
  }
}

for (const num of range) {
  console.log(num) // 1, 2, 3, 4, 5
}

// Generator функция
function* rangeGenerator(from, to) {
  for (let i = from; i <= to; i++) {
    yield i
  }
}

console.log([...rangeGenerator(1, 5)]) // [1, 2, 3, 4, 5]

// Async generator для пагинации
async function* fetchPages(url) {
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(\`\${url}?page=\${page}\`)
    const data = await response.json()

    yield* data.items // yield каждый элемент

    hasMore = data.hasNextPage
    page++
  }
}

// Использование
for await (const item of fetchPages('/api/products')) {
  console.log(item)
}

// Бесконечный генератор с fibonacci
function* fibonacci() {
  let [prev, curr] = [0, 1]
  while (true) {
    yield curr
    ;[prev, curr] = [curr, prev + curr]
  }
}

// Взять первые 10 чисел
const fib = fibonacci()
const first10 = Array.from({ length: 10 }, () => fib.next().value)

// Генератор для обхода дерева
function* walkTree(node) {
  yield node
  if (node.children) {
    for (const child of node.children) {
      yield* walkTree(child)
    }
  }
}

const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4 }] },
    { value: 3 }
  ]
}

for (const node of walkTree(tree)) {
  console.log(node.value) // 1, 2, 4, 3
}`,
    language: 'js',
    level: 'advanced',
    tags: ['javascript', 'iterators', 'generators', 'async'],
    whyRelevant2026: 'Генераторы незаменимы для ленивых вычислений и стриминга',
    related: ['js-async-iteration', 'js-symbol-iterator']
  },
  {
    id: 'js-weakmap-weakset',
    title: 'WeakMap и WeakSet',
    description: 'Слабые ссылки для кэширования',
    code: `// WeakMap для приватных данных
const privateData = new WeakMap()

class User {
  constructor(name, password) {
    this.name = name
    // Пароль хранится приватно
    privateData.set(this, { password })
  }

  checkPassword(input) {
    return privateData.get(this).password === input
  }
}

const user = new User('John', 'secret123')
console.log(user.name) // 'John'
console.log(user.password) // undefined
console.log(user.checkPassword('secret123')) // true

// WeakMap для кэширования вычислений
const cache = new WeakMap()

function expensiveComputation(obj) {
  if (cache.has(obj)) {
    console.log('From cache')
    return cache.get(obj)
  }

  console.log('Computing...')
  const result = Object.keys(obj).length // дорогая операция
  cache.set(obj, result)
  return result
}

const data = { a: 1, b: 2, c: 3 }
expensiveComputation(data) // "Computing..." -> 3
expensiveComputation(data) // "From cache" -> 3

// Когда data будет удалён, кэш очистится автоматически

// WeakSet для отслеживания объектов
const processed = new WeakSet()

function processOnce(obj) {
  if (processed.has(obj)) {
    console.log('Already processed')
    return
  }

  // Обработка
  console.log('Processing:', obj)
  processed.add(obj)
}

const item = { id: 1 }
processOnce(item) // "Processing: { id: 1 }"
processOnce(item) // "Already processed"

// WeakMap для связи DOM элементов с данными
const elementData = new WeakMap()

function attachData(element, data) {
  elementData.set(element, data)
}

function getData(element) {
  return elementData.get(element)
}

// При удалении элемента из DOM, данные автоматически очистятся
const div = document.createElement('div')
attachData(div, { clicks: 0 })
getData(div) // { clicks: 0 }`,
    language: 'js',
    level: 'intermediate',
    tags: ['javascript', 'weakmap', 'weakset', 'memory'],
    whyRelevant2026: 'WeakMap/WeakSet предотвращают утечки памяти',
    related: ['js-map-set', 'js-private-fields']
  },
  {
    id: 'js-symbols-usage',
    title: 'Symbols и Well-Known Symbols',
    description: 'Использование символов для метапрограммирования',
    code: `// Уникальные ключи
const ID = Symbol('id')
const SECRET = Symbol('secret')

const user = {
  name: 'John',
  [ID]: 123,
  [SECRET]: 'hidden'
}

console.log(user.name) // 'John'
console.log(user[ID]) // 123
console.log(Object.keys(user)) // ['name'] - символы не перечисляются

// Symbol.for - глобальный реестр
const SHARED = Symbol.for('app.shared')
const SAME = Symbol.for('app.shared')
console.log(SHARED === SAME) // true

// Well-known symbols

// Symbol.iterator - кастомная итерация
const playlist = {
  songs: ['Song 1', 'Song 2', 'Song 3'],
  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => ({
        done: index >= this.songs.length,
        value: this.songs[index++]
      })
    }
  }
}

for (const song of playlist) {
  console.log(song)
}

// Symbol.toStringTag - кастомный тег типа
class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyClass'
  }
}

console.log(Object.prototype.toString.call(new MyClass())) // '[object MyClass]'

// Symbol.toPrimitive - кастомное преобразование
const money = {
  amount: 100,
  currency: 'USD',
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount
    if (hint === 'string') return \`\${this.amount} \${this.currency}\`
    return this.amount
  }
}

console.log(+money) // 100
console.log(\`Total: \${money}\`) // "Total: 100 USD"
console.log(money + 50) // 150

// Symbol.hasInstance - кастомный instanceof
class Range {
  constructor(from, to) {
    this.from = from
    this.to = to
  }

  static [Symbol.hasInstance](value) {
    return typeof value === 'number' &&
      value >= this.prototype.from &&
      value <= this.prototype.to
  }
}

Range.prototype.from = 0
Range.prototype.to = 100

console.log(50 instanceof Range) // true
console.log(150 instanceof Range) // false`,
    language: 'js',
    level: 'advanced',
    tags: ['javascript', 'symbols', 'metaprogramming'],
    whyRelevant2026: 'Well-known symbols позволяют глубокую кастомизацию поведения',
    related: ['js-iterators-generators', 'js-proxy-reactive']
  },
  {
    id: 'js-module-patterns',
    title: 'Современные паттерны модулей',
    description: 'ES Modules и динамический импорт',
    code: `// Named exports
// math.js
export const PI = 3.14159
export function add(a, b) { return a + b }
export function multiply(a, b) { return a * b }

// Default export
// logger.js
export default class Logger {
  log(message) { console.log(message) }
}

// Re-exports
// index.js
export { add, multiply } from './math.js'
export { default as Logger } from './logger.js'
export * as utils from './utils.js'

// Dynamic import
async function loadModule(moduleName) {
  const module = await import(\`./modules/\${moduleName}.js\`)
  return module.default
}

// Условный импорт
const logger = process.env.NODE_ENV === 'development'
  ? await import('./dev-logger.js')
  : await import('./prod-logger.js')

// Import с assertion (для JSON, CSS)
const config = await import('./config.json', {
  with: { type: 'json' }
})

const styles = await import('./styles.css', {
  with: { type: 'css' }
})
document.adoptedStyleSheets.push(styles.default)

// Ленивая загрузка компонентов
const components = {
  async loadChart() {
    const { Chart } = await import('./components/Chart.js')
    return Chart
  },
  async loadTable() {
    const { Table } = await import('./components/Table.js')
    return Table
  }
}

// Top-level await
const data = await fetch('/api/config').then(r => r.json())
export const apiUrl = data.apiUrl

// Module preloading
// В HTML: <link rel="modulepreload" href="./heavy-module.js">

// Import.meta
console.log(import.meta.url) // URL текущего модуля
console.log(import.meta.resolve('./utils.js')) // Полный URL`,
    language: 'js',
    level: 'intermediate',
    tags: ['javascript', 'modules', 'esm', 'import'],
    whyRelevant2026: 'ES Modules с import assertions - стандарт загрузки ресурсов',
    related: ['js-dynamic-import', 'js-code-splitting']
  },
  {
    id: 'js-error-handling',
    title: 'Современная обработка ошибок',
    description: 'Error cause, AggregateError и паттерны',
    code: `// Error cause (ES2022)
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`)
    if (!response.ok) {
      throw new Error('Failed to fetch user', {
        cause: { status: response.status, statusText: response.statusText }
      })
    }
    return response.json()
  } catch (error) {
    throw new Error('User service error', { cause: error })
  }
}

try {
  await fetchUser('123')
} catch (error) {
  console.log(error.message) // 'User service error'
  console.log(error.cause.message) // 'Failed to fetch user'
  console.log(error.cause.cause) // { status: 404, statusText: 'Not Found' }
}

// AggregateError для множественных ошибок
async function fetchAllUsers(ids) {
  const results = await Promise.allSettled(ids.map(fetchUser))

  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason)

  if (errors.length > 0) {
    throw new AggregateError(errors, 'Some users failed to fetch')
  }

  return results.filter(r => r.status === 'fulfilled').map(r => r.value)
}

try {
  await fetchAllUsers(['1', '2', '3'])
} catch (error) {
  if (error instanceof AggregateError) {
    console.log('Failed count:', error.errors.length)
    error.errors.forEach(e => console.log(e.message))
  }
}

// Кастомные типы ошибок
class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

class NetworkError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'NetworkError'
    this.status = status
  }
}

// Обработка по типу
try {
  // ...
} catch (error) {
  if (error instanceof ValidationError) {
    showFieldError(error.field, error.message)
  } else if (error instanceof NetworkError) {
    showNetworkError(error.status)
  } else {
    showGenericError(error)
  }
}

// Safe wrapper
function tryCatch(fn) {
  return async (...args) => {
    try {
      return [await fn(...args), null]
    } catch (error) {
      return [null, error]
    }
  }
}

const safeJsonParse = tryCatch(JSON.parse)
const [data, error] = safeJsonParse('{"valid": true}')`,
    language: 'js',
    level: 'intermediate',
    tags: ['javascript', 'errors', 'error-handling', 'es2022'],
    whyRelevant2026: 'Error cause делает отладку значительно проще',
    related: ['ts-result-pattern', 'js-async-await']
  }
]

export default modernPatterns
