import { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Heart, Share2, Copy, Check, Code2, FileText, Sparkles, Eye } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/code/CodeBlock'
import { useFavoritesStore } from '@/store/favoritesStore'
import { cn } from '@/lib/utils'
import type { Snippet, SkillLevel } from '@/types'

// === CVA Variants ===

const cardVariants = cva(
  'transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'hover:shadow-md hover:border-primary/20',
        compact: 'hover:shadow-sm',
        featured: 'border-primary/50 bg-primary/5 hover:shadow-lg',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.01]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
    },
  }
)

const levelBadgeVariants = cva(
  'text-xs font-medium',
  {
    variants: {
      level: {
        beginner: 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20',
        intermediate: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20',
        advanced: 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20',
      },
    },
    defaultVariants: {
      level: 'beginner',
    },
  }
)

// === Constants ===

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

// === Types ===

interface SnippetCardProps extends VariantProps<typeof cardVariants> {
  snippet: Snippet
  defaultTab?: 'description' | 'code' | 'why2026' | 'preview'
  className?: string
}

// === Component ===

export function SnippetCard({
  snippet,
  variant,
  interactive,
  defaultTab = 'description',
  className,
}: SnippetCardProps) {
  const [copied, setCopied] = useState(false)

  // Zustand store для избранного
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(snippet.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  // Определяем доступные табы
  const availableTabs = [
    { id: 'description', label: 'Описание', icon: FileText },
    { id: 'code', label: 'Код', icon: Code2 },
    ...(snippet.whyRelevant2026
      ? [{ id: 'why2026', label: '2026', icon: Sparkles }]
      : []),
    ...(snippet.preview
      ? [{ id: 'preview', label: 'Preview', icon: Eye }]
      : []),
  ]

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      toast.success('Код скопирован в буфер обмена')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Не удалось скопировать код')
    }
  }

  const handleFavorite = () => {
    toggleFavorite(snippet.id)
    toast.success(!isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного')
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/snippet/${snippet.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: snippet.title,
          text: snippet.description,
          url,
        })
      } catch (err) {
        // Пользователь отменил или ошибка
        if ((err as Error).name !== 'AbortError') {
          await fallbackShare(url)
        }
      }
    } else {
      await fallbackShare(url)
    }
  }

  const fallbackShare = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Ссылка скопирована')
    } catch {
      toast.error('Не удалось скопировать ссылку')
    }
  }

  return (
    <Card className={cn(cardVariants({ variant, interactive }), className)}>
      <CardHeader className="pb-3">
        {/* Header: Title + Level Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h3 className="font-mono text-lg font-semibold leading-tight truncate">
              {snippet.title}
            </h3>
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {snippet.tags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-1.5 py-0"
                >
                  {tag}
                </Badge>
              ))}
              {snippet.tags.length > 5 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  +{snippet.tags.length - 5}
                </Badge>
              )}
            </div>
          </div>

          {/* Level Badge */}
          <Badge
            className={cn(
              levelBadgeVariants({ level: snippet.level }),
              'shrink-0'
            )}
          >
            {levelLabels[snippet.level]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tabs */}
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full justify-start h-9 bg-muted/50">
            {availableTabs.map(({ id, label, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="text-xs data-[state=active]:bg-background"
              >
                <Icon className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description" className="mt-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {snippet.description}
            </p>

            {/* Related snippets */}
            {snippet.related && snippet.related.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">
                  Связанные:{' '}
                  {snippet.related.map((id, i) => (
                    <span key={id}>
                      <code className="text-xs bg-muted px-1 rounded">
                        {id}
                      </code>
                      {i < snippet.related!.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="mt-3">
            <CodeBlock
              code={snippet.code}
              language={snippet.language}
              showLineNumbers
              className="max-h-[400px] overflow-auto"
            />
          </TabsContent>

          {/* Why 2026 Tab */}
          {snippet.whyRelevant2026 && (
            <TabsContent value="why2026" className="mt-3">
              <div className="flex gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  {snippet.whyRelevant2026}
                </p>
              </div>
            </TabsContent>
          )}

          {/* Preview Tab */}
          {snippet.preview && (
            <TabsContent value="preview" className="mt-3">
              <CodeBlock
                code={snippet.preview}
                language={snippet.language}
                variant="ghost"
              />
            </TabsContent>
          )}
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            className="flex-1 sm:flex-none"
            aria-label={copied ? 'Код скопирован' : 'Копировать код'}
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            <span className="hidden sm:inline">
              {copied ? 'Скопировано' : 'Копировать'}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className={cn(
              'shrink-0 transition-colors',
              isFavorite && 'text-red-500 hover:text-red-600'
            )}
            aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            aria-pressed={isFavorite}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-all',
                isFavorite && 'fill-current scale-110'
              )}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="shrink-0"
            aria-label="Поделиться сниппетом"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// === Exports ===

export { cardVariants, levelBadgeVariants }
export type { SnippetCardProps }
