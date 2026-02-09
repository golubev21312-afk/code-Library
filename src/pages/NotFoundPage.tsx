import { useState } from 'react'
import { usePageMeta } from '@/hooks/usePageMeta'
import { Link } from 'react-router-dom'
import { Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const funMessages = [
  'Упс! Эта страница ушла в отпуск',
  'Кажется, здесь ничего нет...',
  '404: Страница не найдена',
  'Вы забрели слишком далеко',
  'Эта страница играет в прятки',
  'Тут должен был быть код, но он сбежал',
]

export function NotFoundPage() {
  usePageMeta({ title: '404 — Страница не найдена' })

  const [imageId, setImageId] = useState(() => Math.floor(Math.random() * 1000))
  const [message] = useState(() => funMessages[Math.floor(Math.random() * funMessages.length)])

  const refreshImage = () => {
    setImageId(Math.floor(Math.random() * 1000))
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-8xl font-bold text-muted-foreground/50">404</h1>

        <p className="text-xl text-muted-foreground">{message}</p>

        {/* Random nature image from picsum */}
        <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
          <img
            src={`https://picsum.photos/seed/${imageId}/800/450`}
            alt="Random nature"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={refreshImage}
            className="absolute top-3 right-3 opacity-80 hover:opacity-100"
            title="Другая картинка"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Пока вы любуетесь картинкой, можете вернуться на главную
        </p>

        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link to="/" className="gap-2">
              <Home className="h-4 w-4" />
              На главную
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/snippets">
              К сниппетам
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
