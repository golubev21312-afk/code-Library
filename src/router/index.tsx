import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/pages/HomePage'

const SnippetsPage = lazy(() => import('@/pages/SnippetsPage').then((m) => ({ default: m.SnippetsPage })))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })))
const QuizPage = lazy(() => import('@/pages/QuizPage').then((m) => ({ default: m.QuizPage })))
const TagsPage = lazy(() => import('@/pages/TagsPage').then((m) => ({ default: m.TagsPage })))
const SnippetPage = lazy(() => import('@/pages/SnippetPage').then((m) => ({ default: m.SnippetPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="container py-6 text-center text-muted-foreground">Загрузка...</div>}>
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'snippets',
        element: <LazyPage><SnippetsPage /></LazyPage>,
      },
      {
        path: 'favorites',
        element: <LazyPage><FavoritesPage /></LazyPage>,
      },
      {
        path: 'quiz',
        element: <LazyPage><QuizPage /></LazyPage>,
      },
      {
        path: 'tags',
        element: <LazyPage><TagsPage /></LazyPage>,
      },
      {
        path: 'snippet/:id',
        element: <LazyPage><SnippetPage /></LazyPage>,
      },
      {
        path: '*',
        element: <LazyPage><NotFoundPage /></LazyPage>,
      },
    ],
  },
])
