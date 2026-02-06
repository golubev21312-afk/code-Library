import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/pages/HomePage'
import { SnippetsPage } from '@/pages/SnippetsPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { QuizPage } from '@/pages/QuizPage'
import { SnippetPage } from '@/pages/SnippetPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { TagsPage } from '@/pages/TagsPage'

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
        element: <SnippetsPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: 'quiz',
        element: <QuizPage />,
      },
      {
        path: 'tags',
        element: <TagsPage />,
      },
      {
        path: 'snippet/:id',
        element: <SnippetPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
