import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SnippetCard } from '@/components/snippets/SnippetCard'
import { getSnippetById } from '@/data/snippets'
import { AnimatedCard } from '@/components/animations/AnimatedCard'

export function SnippetPage() {
  const { id } = useParams<{ id: string }>()
  const snippet = id ? getSnippetById(id) : undefined

  if (!snippet) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">404</div>
          <h1 className="text-2xl font-bold">Сниппет не найден</h1>
          <p className="text-muted-foreground">
            Сниппет с ID "{id}" не существует
          </p>
          <Button asChild>
            <Link to="/snippets" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              К сниппетам
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Найти связанные сниппеты
  const relatedSnippets = snippet.related
    ?.map(relId => getSnippetById(relId))
    .filter(Boolean) ?? []

  return (
    <div className="container py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <Link to="/snippets" className="hover:text-foreground transition-colors">
            Сниппеты
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{snippet.title}</span>
        </nav>

        {/* Main snippet */}
        <AnimatedCard>
          <SnippetCard snippet={snippet} defaultTab="code" />
        </AnimatedCard>

        {/* Related snippets */}
        {relatedSnippets.length > 0 && (
          <div className="space-y-4 pt-6 border-t">
            <h2 className="text-lg font-semibold">Связанные сниппеты</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedSnippets.map((related, index) => (
                <AnimatedCard key={related!.id} delay={index * 100}>
                  <Link to={`/snippet/${related!.id}`}>
                    <SnippetCard snippet={related!} />
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="pt-4">
          <Button variant="outline" asChild>
            <Link to="/snippets" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Все сниппеты
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
