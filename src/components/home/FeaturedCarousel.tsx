import { useMemo } from 'react'
import { SnippetPreviewCard } from '@/components/home/SnippetPreviewCard'
import type { Snippet } from '@/types'

interface FeaturedCarouselProps {
  snippets: Snippet[]
}

export function FeaturedCarousel({ snippets }: FeaturedCarouselProps) {
  // Дублируем сниппеты для бесконечной карусели (мемоизировано)
  const duplicatedSnippets = useMemo(() => [...snippets, ...snippets], [snippets])

  return (
    <div className="carousel-container py-4">
      <div className="carousel-track">
        {duplicatedSnippets.map((snippet, index) => (
          <div key={`${snippet.id}-${index}`} className="carousel-item">
            <SnippetPreviewCard snippet={snippet} />
          </div>
        ))}
      </div>
    </div>
  )
}
