import type { Snippet } from '@/types'

export const decorators: Snippet[] = [
  {
    id: 'ts-class-decorator',
    title: 'Class Decorator',
    description: 'Декоратор класса в TypeScript 5+',
    code: `// TypeScript 5+ декораторы (стандарт ECMAScript)
type Constructor<T = {}> = new (...args: any[]) => T

// Простой декоратор логирования
function logged<T extends Constructor>(
  target: T,
  context: ClassDecoratorContext
) {
  return class extends target {
    constructor(...args: any[]) {
      console.log(\`Creating instance of \${context.name}\`)
      super(...args)
    }
  }
}

@logged
class UserService {
  constructor(public name: string) {}
}

// Декоратор с параметрами
function singleton<T extends Constructor>(
  target: T,
  context: ClassDecoratorContext
) {
  let instance: InstanceType<T> | null = null

  return class extends target {
    constructor(...args: any[]) {
      if (instance) return instance as any
      super(...args)
      instance = this as InstanceType<T>
    }
  }
}

@singleton
class Database {
  connect() { /* ... */ }
}

// Декоратор для регистрации
const registry = new Map<string, Constructor>()

function register(name: string) {
  return function<T extends Constructor>(
    target: T,
    context: ClassDecoratorContext
  ) {
    registry.set(name, target)
    return target
  }
}

@register('user-controller')
class UserController {
  getUsers() { /* ... */ }
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'decorators', 'class', 'es2024'],
    whyRelevant2026: 'TC39 декораторы стали стандартом в TypeScript 5+',
    related: ['ts-method-decorator', 'ts-field-decorator']
  },
  {
    id: 'ts-method-decorator',
    title: 'Method Decorator',
    description: 'Декоратор метода с автобиндингом и логированием',
    code: `// Декоратор метода
function logged(
  target: any,
  context: ClassMethodDecoratorContext
) {
  const methodName = String(context.name)

  return function(this: any, ...args: any[]) {
    console.log(\`Calling \${methodName} with\`, args)
    const result = target.call(this, ...args)
    console.log(\`\${methodName} returned\`, result)
    return result
  }
}

// Декоратор времени выполнения
function timed(
  target: any,
  context: ClassMethodDecoratorContext
) {
  const methodName = String(context.name)

  return async function(this: any, ...args: any[]) {
    const start = performance.now()
    const result = await target.call(this, ...args)
    const duration = performance.now() - start
    console.log(\`\${methodName} took \${duration.toFixed(2)}ms\`)
    return result
  }
}

// Декоратор автобиндинга
function bound(
  target: any,
  context: ClassMethodDecoratorContext
) {
  const methodName = context.name

  context.addInitializer(function(this: any) {
    this[methodName] = this[methodName].bind(this)
  })

  return target
}

// Декоратор debounce
function debounce(ms: number) {
  return function(
    target: any,
    context: ClassMethodDecoratorContext
  ) {
    let timeoutId: ReturnType<typeof setTimeout>

    return function(this: any, ...args: any[]) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => target.call(this, ...args), ms)
    }
  }
}

class SearchService {
  @logged
  @timed
  async search(query: string) {
    return fetch(\`/api/search?q=\${query}\`)
  }

  @bound
  handleClick() {
    console.log(this) // Всегда правильный this
  }

  @debounce(300)
  onInput(value: string) {
    this.search(value)
  }
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'decorators', 'methods', 'patterns'],
    whyRelevant2026: 'Method decorators упрощают cross-cutting concerns',
    related: ['ts-class-decorator', 'ts-field-decorator']
  },
  {
    id: 'ts-field-decorator',
    title: 'Field Decorator',
    description: 'Декоратор поля для валидации и трансформации',
    code: `// Декоратор поля с валидацией
function validate(validator: (value: any) => boolean, message: string) {
  return function(
    target: undefined,
    context: ClassFieldDecoratorContext
  ) {
    return function(initialValue: any) {
      if (!validator(initialValue)) {
        throw new Error(\`\${String(context.name)}: \${message}\`)
      }
      return initialValue
    }
  }
}

// Декоратор для observable поля
function observable(
  target: undefined,
  context: ClassFieldDecoratorContext
) {
  const fieldName = context.name
  const listeners = new Set<(value: any) => void>()

  context.addInitializer(function(this: any) {
    let value = this[fieldName]

    Object.defineProperty(this, fieldName, {
      get: () => value,
      set: (newValue) => {
        value = newValue
        listeners.forEach(fn => fn(newValue))
      }
    })

    this[\`subscribe\${String(fieldName)}\`] = (fn: (v: any) => void) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    }
  })
}

// Декоратор для ленивой инициализации
function lazy<T>(factory: () => T) {
  return function(
    target: undefined,
    context: ClassFieldDecoratorContext
  ) {
    const fieldName = context.name

    context.addInitializer(function(this: any) {
      let value: T | undefined
      let initialized = false

      Object.defineProperty(this, fieldName, {
        get: () => {
          if (!initialized) {
            value = factory()
            initialized = true
          }
          return value
        }
      })
    })
  }
}

class User {
  @validate(v => v.length >= 2, 'Name must be at least 2 chars')
  name: string = ''

  @validate(v => v >= 0, 'Age must be positive')
  age: number = 0

  @observable
  status: string = 'offline'

  @lazy(() => new ExpensiveService())
  service!: ExpensiveService
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'decorators', 'fields', 'validation'],
    whyRelevant2026: 'Field decorators позволяют создавать reactive системы',
    related: ['ts-class-decorator', 'ts-method-decorator']
  },
  {
    id: 'ts-accessor-decorator',
    title: 'Accessor Decorator',
    description: 'Декоратор для автоматических accessor полей',
    code: `// TypeScript 5 accessor keyword + decorators
class Person {
  accessor name: string = ''
  accessor age: number = 0
}

// Декоратор для accessor
function clamp(min: number, max: number) {
  return function(
    target: ClassAccessorDecoratorTarget<any, number>,
    context: ClassAccessorDecoratorContext
  ): ClassAccessorDecoratorResult<any, number> {
    return {
      get(this: any) {
        return target.get.call(this)
      },
      set(this: any, value: number) {
        target.set.call(this, Math.min(max, Math.max(min, value)))
      }
    }
  }
}

// Декоратор для отслеживания изменений
function tracked(
  target: ClassAccessorDecoratorTarget<any, any>,
  context: ClassAccessorDecoratorContext
): ClassAccessorDecoratorResult<any, any> {
  return {
    get(this: any) {
      return target.get.call(this)
    },
    set(this: any, value: any) {
      const oldValue = target.get.call(this)
      target.set.call(this, value)
      console.log(\`\${String(context.name)} changed from \${oldValue} to \${value}\`)
    },
    init(value: any) {
      console.log(\`\${String(context.name)} initialized with \${value}\`)
      return value
    }
  }
}

// Декоратор для валидации типа в runtime
function typed(expectedType: string) {
  return function(
    target: ClassAccessorDecoratorTarget<any, any>,
    context: ClassAccessorDecoratorContext
  ): ClassAccessorDecoratorResult<any, any> {
    return {
      set(this: any, value: any) {
        if (typeof value !== expectedType) {
          throw new TypeError(
            \`\${String(context.name)} must be \${expectedType}, got \${typeof value}\`
          )
        }
        target.set.call(this, value)
      }
    }
  }
}

class Player {
  @tracked
  accessor score: number = 0

  @clamp(0, 100)
  accessor health: number = 100

  @typed('string')
  accessor name: string = ''
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'decorators', 'accessor', 'ts5'],
    whyRelevant2026: 'accessor keyword в TS5 упрощает создание умных свойств',
    related: ['ts-field-decorator', 'ts-class-decorator']
  },
  {
    id: 'ts-dependency-injection',
    title: 'Dependency Injection',
    description: 'Паттерн DI с декораторами',
    code: `// Простой DI контейнер
const container = new Map<string, any>()

// Декоратор для регистрации сервиса
function injectable(token?: string) {
  return function<T extends new (...args: any[]) => any>(
    target: T,
    context: ClassDecoratorContext
  ) {
    const key = token || context.name?.toString() || target.name
    container.set(key, target)
    return target
  }
}

// Декоратор для инжекции
function inject(token: string) {
  return function(
    target: undefined,
    context: ClassFieldDecoratorContext
  ) {
    context.addInitializer(function(this: any) {
      const ServiceClass = container.get(token)
      if (!ServiceClass) {
        throw new Error(\`Service \${token} not found\`)
      }
      this[context.name] = new ServiceClass()
    })
  }
}

// Сервисы
@injectable('logger')
class LoggerService {
  log(message: string) {
    console.log(\`[LOG] \${message}\`)
  }
}

@injectable('http')
class HttpService {
  @inject('logger')
  private logger!: LoggerService

  async get(url: string) {
    this.logger.log(\`GET \${url}\`)
    return fetch(url)
  }
}

@injectable('user')
class UserService {
  @inject('http')
  private http!: HttpService

  @inject('logger')
  private logger!: LoggerService

  async getUser(id: string) {
    this.logger.log(\`Getting user \${id}\`)
    return this.http.get(\`/api/users/\${id}\`)
  }
}

// Использование
const userService = new UserService()
userService.getUser('123')`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'decorators', 'di', 'patterns'],
    whyRelevant2026: 'DI с декораторами - чистый способ управления зависимостями',
    related: ['ts-class-decorator', 'ts-field-decorator']
  },
  {
    id: 'ts-metadata-reflection',
    title: 'Metadata и Reflection',
    description: 'Работа с метаданными через декораторы',
    code: `// Хранилище метаданных
const metadata = new WeakMap<object, Map<string | symbol, any>>()

function setMetadata(target: object, key: string | symbol, value: any) {
  if (!metadata.has(target)) {
    metadata.set(target, new Map())
  }
  metadata.get(target)!.set(key, value)
}

function getMetadata(target: object, key: string | symbol) {
  return metadata.get(target)?.get(key)
}

// Декоратор для роутов
function route(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE') {
  return function(
    target: any,
    context: ClassMethodDecoratorContext
  ) {
    context.addInitializer(function(this: any) {
      const routes = getMetadata(this.constructor, 'routes') || []
      routes.push({
        path,
        method,
        handler: context.name
      })
      setMetadata(this.constructor, 'routes', routes)
    })
    return target
  }
}

const Get = (path: string) => route(path, 'GET')
const Post = (path: string) => route(path, 'POST')

// Декоратор для валидации параметров
function Param(name: string, validator: (v: any) => boolean) {
  return function(
    target: any,
    context: ClassMethodDecoratorContext
  ) {
    const original = target

    return function(this: any, ...args: any[]) {
      const params = getMetadata(this.constructor, \`params:\${String(context.name)}\`) || []
      params.forEach((param: any, index: number) => {
        if (!param.validator(args[index])) {
          throw new Error(\`Invalid param: \${param.name}\`)
        }
      })
      return original.call(this, ...args)
    }
  }
}

// Controller
class UserController {
  @Get('/users')
  getAll() {
    return { users: [] }
  }

  @Get('/users/:id')
  getById(id: string) {
    return { id }
  }

  @Post('/users')
  create(data: any) {
    return { created: data }
  }
}

// Получение роутов для регистрации
const controller = new UserController()
const routes = getMetadata(UserController, 'routes')
console.log(routes)
// [{ path: '/users', method: 'GET', handler: 'getAll' }, ...]`,
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'decorators', 'metadata', 'reflection'],
    whyRelevant2026: 'Metadata паттерн используется во всех популярных фреймворках',
    related: ['ts-class-decorator', 'ts-method-decorator']
  }
]

export default decorators
