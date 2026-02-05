import type { Snippet } from '@/types'

export const serverComponents: Snippet[] = [
  {
    id: 'react-server-component',
    title: 'React Server Component',
    description: 'Базовый серверный компонент',
    code: `// app/posts/page.tsx - Server Component по умолчанию
import { db } from '@/lib/db'

// Можно использовать async/await напрямую
export default async function PostsPage() {
  // Этот код выполняется ТОЛЬКО на сервере
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  return (
    <div>
      <h1>Посты</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={\`/posts/\${post.id}\`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Преимущества Server Components:
// - Прямой доступ к базе данных
// - Нет отправки JS клиенту
// - Автоматическое code splitting
// - Можно использовать fs, env переменные

// app/posts/[id]/page.tsx
interface Props {
  params: { id: string }
}

export default async function PostPage({ params }: Props) {
  const post = await db.post.findUnique({
    where: { id: params.id },
    include: { author: true, comments: true }
  })

  if (!post) {
    notFound()
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>Автор: {post.author.name}</p>
      <div>{post.content}</div>

      {/* Клиентский компонент для интерактивности */}
      <CommentForm postId={post.id} />
    </article>
  )
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'rsc', 'server', 'nextjs'],
    whyRelevant2026: 'Server Components - главный паттерн React в 2026',
    related: ['react-client-component', 'react-server-actions']
  },
  {
    id: 'react-client-component',
    title: 'Client Component',
    description: 'Клиентский компонент с интерактивностью',
    code: `'use client' // Директива обязательна!

import { useState, useTransition } from 'react'
import { addComment } from './actions'

interface CommentFormProps {
  postId: string
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      await addComment(postId, content)
      setContent('')
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Ваш комментарий..."
        disabled={isPending}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  )
}

// Клиентские компоненты могут:
// - Использовать useState, useEffect, и другие хуки
// - Обрабатывать события (onClick, onChange)
// - Использовать browser APIs
// - Иметь интерактивные состояния

// Но НЕ могут:
// - Быть async
// - Напрямую обращаться к базе данных
// - Читать файловую систему

// Правило: делайте компоненты серверными по умолчанию,
// используйте 'use client' только когда нужна интерактивность`,
    language: 'ts',
    level: 'intermediate',
    tags: ['react', 'client', 'hooks', 'interactivity'],
    whyRelevant2026: 'Понимание границы server/client критично для React 19',
    related: ['react-server-component', 'react-use-transition']
  },
  {
    id: 'react-server-actions',
    title: 'Server Actions',
    description: 'Серверные действия для мутаций',
    code: `// app/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { z } from 'zod'

// Схема валидации
const PostSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10)
})

// Server Action
export async function createPost(formData: FormData) {
  // Валидация
  const validated = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content')
  })

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  // Создание в БД
  const post = await db.post.create({
    data: validated.data
  })

  // Инвалидация кэша
  revalidatePath('/posts')
  revalidateTag('posts')

  // Редирект
  redirect(\`/posts/\${post.id}\`)
}

// Action с возвратом данных
export async function toggleLike(postId: string) {
  const session = await getSession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const existing = await db.like.findUnique({
    where: {
      postId_userId: { postId, userId: session.user.id }
    }
  })

  if (existing) {
    await db.like.delete({ where: { id: existing.id } })
    return { liked: false }
  }

  await db.like.create({
    data: { postId, userId: session.user.id }
  })

  revalidatePath(\`/posts/\${postId}\`)
  return { liked: true }
}

// Использование в форме
export default function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Заголовок" />
      <textarea name="content" placeholder="Контент" />
      <button type="submit">Создать</button>
    </form>
  )
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'server-actions', 'forms', 'mutations'],
    whyRelevant2026: 'Server Actions заменяют API routes для мутаций',
    related: ['react-server-component', 'react-use-form-state']
  },
  {
    id: 'react-use-form-state',
    title: 'useActionState',
    description: 'Обработка состояния форм с Server Actions',
    code: `'use client'

import { useActionState } from 'react'
import { createUser } from './actions'

// Server Action
// app/actions.ts
'use server'

interface FormState {
  message: string
  errors?: {
    email?: string[]
    password?: string[]
  }
}

export async function createUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Валидация
  const errors: FormState['errors'] = {}

  if (!email.includes('@')) {
    errors.email = ['Некорректный email']
  }
  if (password.length < 8) {
    errors.password = ['Минимум 8 символов']
  }

  if (Object.keys(errors).length > 0) {
    return { message: 'Ошибка валидации', errors }
  }

  // Создание пользователя
  await db.user.create({ data: { email, password } })

  return { message: 'Пользователь создан!' }
}

// Client Component
export function SignupForm() {
  const [state, formAction, isPending] = useActionState(createUser, {
    message: ''
  })

  return (
    <form action={formAction}>
      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          aria-describedby="email-error"
        />
        {state.errors?.email && (
          <p id="email-error" className="error">
            {state.errors.email.join(', ')}
          </p>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          aria-describedby="password-error"
        />
        {state.errors?.password && (
          <p id="password-error" className="error">
            {state.errors.password.join(', ')}
          </p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>

      {state.message && <p>{state.message}</p>}
    </form>
  )
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'forms', 'useActionState', 'validation'],
    whyRelevant2026: 'useActionState - новый хук React 19 для форм',
    related: ['react-server-actions', 'react-use-optimistic']
  },
  {
    id: 'react-use-optimistic',
    title: 'useOptimistic',
    description: 'Оптимистичные обновления UI',
    code: `'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleLike, addComment } from './actions'

interface Comment {
  id: string
  content: string
  author: string
  pending?: boolean
}

interface CommentsProps {
  postId: string
  initialComments: Comment[]
}

export function Comments({ postId, initialComments }: CommentsProps) {
  const [isPending, startTransition] = useTransition()

  // Оптимистичное состояние
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: Comment) => [...state, newComment]
  )

  const handleSubmit = async (formData: FormData) => {
    const content = formData.get('content') as string

    // Добавляем оптимистично
    addOptimisticComment({
      id: 'temp-' + Date.now(),
      content,
      author: 'Вы',
      pending: true
    })

    // Отправляем на сервер
    startTransition(async () => {
      await addComment(postId, content)
    })
  }

  return (
    <div>
      <ul>
        {optimisticComments.map(comment => (
          <li
            key={comment.id}
            style={{ opacity: comment.pending ? 0.5 : 1 }}
          >
            <strong>{comment.author}:</strong> {comment.content}
            {comment.pending && <span> (отправка...)</span>}
          </li>
        ))}
      </ul>

      <form action={handleSubmit}>
        <input name="content" placeholder="Комментарий" />
        <button type="submit">Отправить</button>
      </form>
    </div>
  )
}

// Пример с лайками
interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount
}: LikeButtonProps) {
  const [optimistic, setOptimistic] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (state, action: 'like' | 'unlike') => ({
      liked: action === 'like',
      count: state.count + (action === 'like' ? 1 : -1)
    })
  )

  const handleClick = async () => {
    setOptimistic(optimistic.liked ? 'unlike' : 'like')
    await toggleLike(postId)
  }

  return (
    <button onClick={handleClick}>
      {optimistic.liked ? '❤️' : '🤍'} {optimistic.count}
    </button>
  )
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'useOptimistic', 'ui', 'performance'],
    whyRelevant2026: 'useOptimistic делает UI мгновенно отзывчивым',
    related: ['react-server-actions', 'react-use-transition']
  },
  {
    id: 'react-streaming-suspense',
    title: 'Streaming и Suspense',
    description: 'Потоковый рендеринг с Suspense',
    code: `// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Быстрый контент рендерится сразу */}
      <WelcomeMessage />

      {/* Медленные компоненты стримятся по мере готовности */}
      <div className="widgets">
        <Suspense fallback={<WidgetSkeleton />}>
          <RevenueWidget />
        </Suspense>

        <Suspense fallback={<WidgetSkeleton />}>
          <UsersWidget />
        </Suspense>

        <Suspense fallback={<WidgetSkeleton />}>
          <OrdersWidget />
        </Suspense>
      </div>

      {/* Вложенный Suspense для списка */}
      <Suspense fallback={<TableSkeleton rows={5} />}>
        <RecentOrders />
      </Suspense>
    </div>
  )
}

// Async Server Component
async function RevenueWidget() {
  // Этот запрос может быть медленным
  const revenue = await fetchRevenue() // 2 секунды

  return (
    <div className="widget">
      <h3>Выручка</h3>
      <p className="amount">{formatCurrency(revenue.total)}</p>
      <p className="change">+{revenue.changePercent}%</p>
    </div>
  )
}

async function RecentOrders() {
  const orders = await fetchRecentOrders() // 1 секунда

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Клиент</th>
          <th>Сумма</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{formatCurrency(order.amount)}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Скелетоны для загрузки
function WidgetSkeleton() {
  return (
    <div className="widget skeleton">
      <div className="skeleton-line w-1/2 h-4" />
      <div className="skeleton-line w-3/4 h-8 mt-2" />
      <div className="skeleton-line w-1/4 h-4 mt-2" />
    </div>
  )
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'suspense', 'streaming', 'ssr'],
    whyRelevant2026: 'Streaming SSR значительно улучшает TTFB и LCP',
    related: ['react-server-component', 'react-error-boundary']
  },
  {
    id: 'react-parallel-routes',
    title: 'Параллельные роуты',
    description: 'Независимая загрузка секций страницы',
    code: `// Next.js App Router параллельные роуты
// Структура папок:
// app/
//   layout.tsx
//   page.tsx
//   @sidebar/
//     page.tsx
//     loading.tsx
//   @main/
//     page.tsx
//     loading.tsx

// app/layout.tsx
export default function Layout({
  children,
  sidebar,
  main
}: {
  children: React.ReactNode
  sidebar: React.ReactNode
  main: React.ReactNode
}) {
  return (
    <div className="layout">
      <aside className="sidebar">
        {sidebar}
      </aside>
      <main className="main">
        {main}
      </main>
      {children}
    </div>
  )
}

// app/@sidebar/page.tsx
export default async function Sidebar() {
  const navigation = await fetchNavigation()

  return (
    <nav>
      {navigation.map(item => (
        <a key={item.id} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  )
}

// app/@sidebar/loading.tsx
export default function SidebarLoading() {
  return <nav className="skeleton">Loading nav...</nav>
}

// app/@main/page.tsx
export default async function Main() {
  const content = await fetchMainContent()

  return (
    <article>
      <h1>{content.title}</h1>
      <div>{content.body}</div>
    </article>
  )
}

// Условный рендеринг слотов
// app/layout.tsx
export default function Layout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {/* modal рендерится поверх при определённых условиях */}
      {modal}
    </>
  )
}

// Intercepting routes для модалок
// app/@modal/(.)photo/[id]/page.tsx
export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <dialog open>
      <Photo id={params.id} />
    </dialog>
  )
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'nextjs', 'routing', 'parallel'],
    whyRelevant2026: 'Параллельные роуты улучшают UX независимой загрузкой',
    related: ['react-streaming-suspense', 'react-server-component']
  },
  {
    id: 'react-cache-revalidation',
    title: 'Кэширование и ревалидация',
    description: 'Стратегии кэширования в Server Components',
    code: `import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { revalidatePath, revalidateTag } from 'next/cache'

// React cache - дедупликация запросов в рендер-цикле
const getUser = cache(async (id: string) => {
  console.log('Fetching user', id) // Вызовется только 1 раз
  return db.user.findUnique({ where: { id } })
})

// В разных компонентах одного рендера
async function Header() {
  const user = await getUser('123') // Запрос
  return <div>{user.name}</div>
}

async function Sidebar() {
  const user = await getUser('123') // Кэш из Header
  return <div>{user.avatar}</div>
}

// Next.js unstable_cache - персистентный кэш
const getCachedPosts = unstable_cache(
  async (category: string) => {
    return db.post.findMany({ where: { category } })
  },
  ['posts'], // Ключ кэша
  {
    tags: ['posts'],
    revalidate: 3600 // 1 час
  }
)

// Fetch с кэшированием
async function getData() {
  // Кэшируется по умолчанию
  const res = await fetch('https://api.example.com/data')

  // Без кэша
  const fresh = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  })

  // Ревалидация по времени
  const timed = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 } // 60 секунд
  })

  // Теги для on-demand ревалидации
  const tagged = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  })
}

// Server Action с ревалидацией
'use server'

export async function createPost(data: FormData) {
  await db.post.create({ data: { ... } })

  // Ревалидация по пути
  revalidatePath('/posts')
  revalidatePath('/posts/[id]', 'page')

  // Ревалидация по тегу
  revalidateTag('posts')
}

// On-demand revalidation через API
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { tag, secret } = await request.json()

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidateTag(tag)
  return Response.json({ revalidated: true })
}`,
    language: 'ts',
    level: 'advanced',
    tags: ['react', 'cache', 'revalidation', 'nextjs'],
    whyRelevant2026: 'Правильное кэширование критично для производительности RSC',
    related: ['react-server-component', 'react-server-actions']
  }
]

export default serverComponents
