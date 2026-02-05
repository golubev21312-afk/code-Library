import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SnippetCard } from '@/components/snippets/SnippetCard'
import { useFavorites } from '@/store/favoritesStore'
import {
  getSnippetsByCategory,
  getCategories,
  getSnippetsStats,
} from '@/data/snippets'
import type { SkillLevel } from '@/types'

const categoryLabels: Record<string, string> = {
  typescript: 'TypeScript',
  react: 'React',
  css: 'CSS',
  patterns: 'Паттерны',
}

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

export function SnippetsPage() {
  const [levelFilter, setLevelFilter] = useState<SkillLevel | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')

  // Zustand store для избранного
  const { count: favoritesCount } = useFavorites()

  const snippetsByCategory = getSnippetsByCategory()
  const categories = getCategories()
  const stats = getSnippetsStats()

  // Собираем все сниппеты или по выбранной категории
  const snippetsToShow =
    categoryFilter === 'all'
      ? Array.from(snippetsByCategory.values()).flat()
      : snippetsByCategory.get(categoryFilter) ?? []

  // Фильтруем по уровню
  const filtered =
    levelFilter === 'all'
      ? snippetsToShow
      : snippetsToShow.filter((s) => s.level === levelFilter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Code Library</h1>
        <p className="text-muted-foreground mt-1">
          {stats.total} сниппетов в {stats.categories} категориях
          {favoritesCount > 0 && ` • ${favoritesCount} в избранном`}
        </p>
      </div>

      {/* Фильтр по категориям */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoryFilter('all')}
        >
          Все категории
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter(category)}
          >
            {categoryLabels[category] ?? category}{' '}
            <span className="ml-1 text-muted-foreground">
              ({stats.byCategory[category]})
            </span>
          </Button>
        ))}
      </div>

      {/* Фильтр по уровню */}
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

      {/* Список сниппетов */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {filtered.length > 0 ? (
          filtered.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8 col-span-full">
            Сниппеты не найдены
          </p>
        )}
      </div>
    </div>
  )
}
