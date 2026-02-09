import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { HomePage } from '@/pages/HomePage'

const SnippetsPage = lazy(() => import('@/pages/SnippetsPage').then((m) => ({ default: m.SnippetsPage })))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })))
const QuizPage = lazy(() => import('@/pages/QuizPage').then((m) => ({ default: m.QuizPage })))
const TagsPage = lazy(() => import('@/pages/TagsPage').then((m) => ({ default: m.TagsPage })))
const SnippetPage = lazy(() => import('@/pages/SnippetPage').then((m) => ({ default: m.SnippetPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="container py-6 text-center text-muted-foreground">Загрузка...</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ErrorBoundary><HomePage /></ErrorBoundary>,
      },
      {
        path: 'snippets',
        element: <PageWrapper><SnippetsPage /></PageWrapper>,
      },
      {
        path: 'favorites',
        element: <PageWrapper><FavoritesPage /></PageWrapper>,
      },
      {
        path: 'quiz',
        element: <PageWrapper><QuizPage /></PageWrapper>,
      },
      {
        path: 'tags',
        element: <PageWrapper><TagsPage /></PageWrapper>,
      },
      {
        path: 'snippet/:id',
        element: <PageWrapper><SnippetPage /></PageWrapper>,
      },
      {
        path: '*',
        element: <PageWrapper><NotFoundPage /></PageWrapper>,
      },
    ],
  },
])
