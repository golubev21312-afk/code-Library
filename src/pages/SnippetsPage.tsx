import { useState } from 'react'
import { LayoutGrid, Layers, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SnippetCard } from '@/components/snippets/SnippetCard'
import { SnippetsByLevel } from '@/components/snippets/SnippetsByLevel'
import { LanguageIcon } from '@/components/common/LanguageIcon'
import { AnimatedCard } from '@/components/animations/AnimatedCard'
import { useFavorites } from '@/store/favoritesStore'
import { useSnippetFilters } from '@/hooks/useSnippetFilters'
import type { SkillLevel } from '@/types'
import { cn } from '@/lib/utils'

const categoryConfig: Record<string, { label: string; language: string }> = {
  typescript: { label: 'TypeScript', language: 'ts' },
  javascript: { label: 'JavaScript', language: 'js' },
  react: { label: 'React', language: 'react' },
  css: { label: 'CSS', language: 'css' },
  html: { label: 'HTML', language: 'html' },
}

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

type ViewMode = 'grid' | 'byLevel'

export function SnippetsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const { count: favoritesCount } = useFavorites()

  const {
    searchQuery,
    setSearchQuery,
    levelFilter,
    setLevelFilter,
    categoryFilter,
    handleCategoryChange,
    categories,
    stats,
    filtered,
  } = useSnippetFilters({ syncWithUrl: true })

  return (
    <div className="container py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Все сниппеты</h1>
            <p className="text-muted-foreground mt-1">
              {stats.total} сниппетов в {stats.categories} категориях
              {favoritesCount > 0 && ` • ${favoritesCount} в избранном`}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Сетка</span>
            </Button>
            <Button
              variant={viewMode === 'byLevel' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('byLevel')}
              className="gap-2"
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">По уровню</span>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск сниппетов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange('all')}
          >
            Все категории
          </Button>
          {categories.map((category) => {
            const config = categoryConfig[category]
            return (
              <Button
                key={category}
                variant={categoryFilter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="gap-2"
              >
                {config && <LanguageIcon language={config.language} size="sm" />}
                {config?.label ?? category}{' '}
                <span className={cn(
                  categoryFilter === category ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>
                  ({stats.byCategory[category]})
                </span>
              </Button>
            )
          })}
        </div>

        {/* Level filter (only in grid mode) */}
        {viewMode === 'grid' && (
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
        )}

        {/* Snippets list */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filtered.length > 0 ? (
              filtered.map((snippet, index) => (
                <AnimatedCard key={snippet.id} delay={index * 30}>
                  <SnippetCard snippet={snippet} />
                </AnimatedCard>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8 col-span-full">
                Сниппеты не найдены
              </p>
            )}
          </div>
        ) : (
          <SnippetsByLevel snippets={filtered} />
        )}
      </div>
    </div>
  )
}
