import { Link } from 'react-router-dom'
import { Code2, Heart, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSnippetsStats } from '@/data/snippets'
import { useFavorites } from '@/store/favoritesStore'

export function HeroSection() {
  const stats = getSnippetsStats()
  const { count: favoritesCount } = useFavorites()

  const statsItems = [
    { label: 'Сниппетов', value: stats.total, icon: Code2 },
    { label: 'Категорий', value: stats.categories, icon: BookOpen },
    { label: 'В избранном', value: favoritesCount, icon: Heart },
  ]

  return (
    <div className="relative py-16 md:py-24">
      <div className="container relative z-10">
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            Актуальная коллекция 2026
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Библиотека{' '}
            <span className="text-gradient">Code Snippets</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Современные паттерны и готовые решения для TypeScript, React, CSS и JavaScript.
            Копируй, учись, применяй в своих проектах.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2 min-w-[180px]" asChild>
              <Link to="/snippets">
                <Code2 className="h-5 w-5" />
                Смотреть сниппеты
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 min-w-[180px]" asChild>
              <Link to="/favorites">
                <Heart className="h-5 w-5" />
                Избранное
                {favoritesCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto">
          {statsItems.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="text-center p-4 rounded-xl bg-card/50 border backdrop-blur-sm"
            >
              <Icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl md:text-3xl font-bold">{value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
