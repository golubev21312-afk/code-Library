import { useState } from 'react'
import { usePageMeta } from '@/hooks/usePageMeta'
import { LayoutGrid, Layers, Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SnippetCard } from '@/components/snippets/SnippetCard'
import { SnippetsByLevel } from '@/components/snippets/SnippetsByLevel'
import { LanguageIcon } from '@/components/common/LanguageIcon'
import { AnimatedCard } from '@/components/animations/AnimatedCard'
import { useFavorites } from '@/store/favoritesStore'
import { useSnippetFilters, type SortOption } from '@/hooks/useSnippetFilters'
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

const ITEMS_PER_PAGE = 20

const sortLabels: Record<SortOption, string> = {
  'default': 'По умолчанию',
  'title-asc': 'А → Я',
  'title-desc': 'Я → А',
  'level-asc': 'Лёгкие сначала',
  'level-desc': 'Сложные сначала',
}

type ViewMode = 'grid' | 'byLevel'

export function SnippetsPage() {
  usePageMeta({ title: 'Все сниппеты', description: 'Каталог 215+ сниппетов с поиском и фильтрами' })

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [page, setPage] = useState(1)
  const { count: favoritesCount } = useFavorites()

  const {
    searchQuery,
    setSearchQuery,
    levelFilter,
    setLevelFilter,
    categoryFilter,
    handleCategoryChange,
    sortBy,
    setSortBy,
    categories,
    stats,
    filtered,
  } = useSnippetFilters({ syncWithUrl: true })

  // Reset page when filters change
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const currentPage = Math.min(page, Math.max(totalPages, 1))
  const paginatedSnippets = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

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

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск сниппетов..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1) }}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { handleCategoryChange('all'); setPage(1) }}
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
                onClick={() => { handleCategoryChange(category); setPage(1) }}
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
              onClick={() => { setLevelFilter('all'); setPage(1) }}
            >
              Все уровни
            </Button>
            {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((level) => (
              <Button
                key={level}
                variant={levelFilter === level ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => { setLevelFilter(level); setPage(1) }}
              >
                {levelLabels[level]}
              </Button>
            ))}
          </div>
        )}

        {/* Snippets list */}
        {viewMode === 'grid' ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {paginatedSnippets.length > 0 ? (
                paginatedSnippets.map((snippet, index) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage <= 1}
                  onClick={() => { setPage(currentPage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  aria-label="Предыдущая страница"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-3">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage >= totalPages}
                  onClick={() => { setPage(currentPage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  aria-label="Следующая страница"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <SnippetsByLevel snippets={filtered} />
        )}
      </div>
    </div>
  )
}
