import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2, ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SnippetCard } from '@/components/snippets/SnippetCard'
import { AnimatedCard } from '@/components/animations/AnimatedCard'
import { useFavorites } from '@/store/favoritesStore'
import { useFilteredSnippets } from '@/hooks/useSnippetFilters'
import { getAllSnippets } from '@/data/snippets'
import type { SkillLevel } from '@/types'

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

export function FavoritesPage() {
  const { favoriteIds, clearFavorites, count } = useFavorites()

  const favoriteSnippets = useMemo(() => {
    const allSnippets = getAllSnippets()
    return allSnippets.filter((s) => favoriteIds.includes(s.id))
  }, [favoriteIds])

  const {
    searchQuery,
    setSearchQuery,
    levelFilter,
    setLevelFilter,
    filtered,
  } = useFilteredSnippets(favoriteSnippets)

  const handleClearAll = () => {
    if (window.confirm('Очистить все избранное?')) {
      clearFavorites()
    }
  }

  // Empty state
  if (count === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Избранное пусто</h1>
            <p className="text-muted-foreground">
              Добавляйте сниппеты в избранное, нажимая на иконку сердца.
              Они будут сохранены здесь для быстрого доступа.
            </p>
          </div>
          <Button className="gap-2" asChild>
            <Link to="/snippets">
              Смотреть сниппеты
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
              Избранное
            </h1>
            <p className="text-muted-foreground mt-1">
              {count} {count === 1 ? 'сниппет' : count < 5 ? 'сниппета' : 'сниппетов'} в избранном
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Очистить все
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск в избранном..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={levelFilter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setLevelFilter('all')}
            >
              Все уровни
            </Button>
            {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((level) => (
              <Button
                key={level}
                variant={levelFilter === level ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setLevelFilter(level)}
              >
                {levelLabels[level]}
              </Button>
            ))}
          </div>
        </div>

        {/* Snippets list */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filtered.map((snippet, index) => (
              <AnimatedCard key={snippet.id} delay={index * 50}>
                <SnippetCard snippet={snippet} />
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Сниппеты не найдены по заданным фильтрам
          </div>
        )}
      </div>
    </div>
  )
}
