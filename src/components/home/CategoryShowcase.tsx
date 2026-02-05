import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LanguageIcon } from '@/components/common/LanguageIcon'
import { AnimatedCard } from '@/components/animations/AnimatedCard'
import { getSnippetsByCategory, getSnippetsStats } from '@/data/snippets'
import { cn } from '@/lib/utils'

const categoryConfig: Record<string, {
  label: string
  description: string
  language: string
  gradient: string
}> = {
  typescript: {
    label: 'TypeScript',
    description: 'Типизация, generics, utility types',
    language: 'ts',
    gradient: 'from-blue-500/10 to-blue-600/5',
  },
  javascript: {
    label: 'JavaScript',
    description: 'ES2025+, async/await, Web APIs',
    language: 'js',
    gradient: 'from-yellow-500/10 to-yellow-600/5',
  },
  react: {
    label: 'React',
    description: 'Hooks, patterns, Server Components',
    language: 'react',
    gradient: 'from-cyan-500/10 to-cyan-600/5',
  },
  css: {
    label: 'CSS',
    description: 'Animations, selectors, Tailwind',
    language: 'css',
    gradient: 'from-purple-500/10 to-purple-600/5',
  },
  html: {
    label: 'HTML',
    description: 'Semantic markup, accessibility',
    language: 'html',
    gradient: 'from-orange-500/10 to-orange-600/5',
  },
}

export function CategoryShowcase() {
  const stats = getSnippetsStats()
  const categories = Object.keys(getSnippetsByCategory())

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Категории сниппетов
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Выбери технологию и найди готовые решения для своего проекта
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const config = categoryConfig[category]
            if (!config) return null

            const count = stats.byCategory[category] ?? 0

            return (
              <AnimatedCard key={category} delay={index * 100}>
                <Link to="/snippets" className="block group">
                  <Card
                    className={cn(
                      'h-full transition-all duration-300',
                      'hover:shadow-lg hover:border-primary/30 hover:-translate-y-1',
                      'bg-gradient-to-br',
                      config.gradient
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <LanguageIcon language={config.language} size="xl" />
                          <div>
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {config.label}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {config.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{count}</span>
                          <p className="text-xs text-muted-foreground">сниппетов</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Смотреть все
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedCard>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/snippets">
            <Button variant="outline" size="lg" className="gap-2">
              Все сниппеты
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
