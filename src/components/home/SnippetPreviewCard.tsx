import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LanguageIcon } from '@/components/common/LanguageIcon'
import { useFavoritesStore } from '@/store/favoritesStore'
import { cn } from '@/lib/utils'
import type { Snippet, SkillLevel } from '@/types'
import { toast } from 'sonner'
import { cva } from 'class-variance-authority'

const levelBadgeVariants = cva(
  'text-xs font-medium',
  {
    variants: {
      level: {
        beginner: 'bg-green-500/10 text-green-600 dark:text-green-400',
        intermediate: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
        advanced: 'bg-red-500/10 text-red-600 dark:text-red-400',
      },
    },
    defaultVariants: {
      level: 'beginner',
    },
  }
)

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

interface SnippetPreviewCardProps {
  snippet: Snippet
  className?: string
}

export function SnippetPreviewCard({ snippet, className }: SnippetPreviewCardProps) {
  const [heartAnim, setHeartAnim] = useState(false)
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(snippet.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isFavorite) {
      setHeartAnim(true)
      setTimeout(() => setHeartAnim(false), 400)
    }
    toggleFavorite(snippet.id)
    toast.success(!isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного')
  }

  return (
    <Link to={`/snippet/${snippet.id}`} className="block group">
      <Card
        className={cn(
          'h-full transition-all duration-300',
          'hover:shadow-lg hover:border-primary/30 hover:-translate-y-1',
          'bg-card/80 backdrop-blur-sm',
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <LanguageIcon language={snippet.language} size="lg" />
              <div className="min-w-0">
                <h3 className="font-mono font-semibold truncate group-hover:text-primary transition-colors">
                  {snippet.title}
                </h3>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className={cn(
                'shrink-0 h-8 w-8 transition-colors',
                isFavorite && 'text-red-500 hover:text-red-600'
              )}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-all',
                  isFavorite && 'fill-current scale-110',
                  heartAnim && 'animate-heart-pop'
                )}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {snippet.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {snippet.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
            {snippet.tags.length > 4 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{snippet.tags.length - 4}
              </Badge>
            )}
          </div>

          {/* Level badge */}
          <div className="pt-2">
            <Badge className={cn(levelBadgeVariants({ level: snippet.level }))}>
              {levelLabels[snippet.level]}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
