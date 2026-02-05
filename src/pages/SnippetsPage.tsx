import { useState } from 'react'
import { CodeBlock } from '@/components/code/CodeBlock'
import { Button } from '@/components/ui/button'
import { utilityTypesSnippets } from '@/data/snippets/typescript/utility-types'
import type { Snippet, SkillLevel } from '@/types'
import { cn } from '@/lib/utils'

const levelColors: Record<SkillLevel, string> = {
  beginner: 'bg-green-500/10 text-green-600 dark:text-green-400',
  intermediate: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  advanced: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-mono text-lg font-semibold">{snippet.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{snippet.description}</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-1 text-xs font-medium',
            levelColors[snippet.level]
          )}
        >
          {levelLabels[snippet.level]}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {snippet.whyRelevant2026 && (
        <p className="text-sm text-muted-foreground border-l-2 border-primary/50 pl-3">
          <strong>2026:</strong> {snippet.whyRelevant2026}
        </p>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="w-full"
      >
        {expanded ? 'Скрыть код' : 'Показать код'}
      </Button>

      {expanded && (
        <CodeBlock
          code={snippet.code}
          language={snippet.language}
          showLineNumbers
        />
      )}
    </div>
  )
}

export function SnippetsPage() {
  const [filter, setFilter] = useState<SkillLevel | 'all'>('all')

  const filtered =
    filter === 'all'
      ? utilityTypesSnippets
      : utilityTypesSnippets.filter((s) => s.level === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">TypeScript Utility Types</h1>
        <p className="text-muted-foreground mt-1">
          {utilityTypesSnippets.length} сниппетов для React-разработки
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Все
        </Button>
        {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((level) => (
          <Button
            key={level}
            variant={filter === level ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(level)}
          >
            {levelLabels[level]}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </div>
  )
}
