import { Zap, Target, Flame } from 'lucide-react'
import { SnippetCard } from './SnippetCard'
import { AnimatedCard } from '@/components/animations/AnimatedCard'
import { cn } from '@/lib/utils'
import type { Snippet, SkillLevel } from '@/types'

interface LevelConfig {
  label: string
  icon: typeof Zap
  bgClass: string
  borderClass: string
  iconClass: string
}

const levelConfigs: Record<SkillLevel, LevelConfig> = {
  beginner: {
    label: 'Начальный уровень',
    icon: Zap,
    bgClass: 'bg-green-500/5',
    borderClass: 'border-green-500/20',
    iconClass: 'text-green-600 dark:text-green-400',
  },
  intermediate: {
    label: 'Средний уровень',
    icon: Target,
    bgClass: 'bg-yellow-500/5',
    borderClass: 'border-yellow-500/20',
    iconClass: 'text-yellow-600 dark:text-yellow-400',
  },
  advanced: {
    label: 'Продвинутый уровень',
    icon: Flame,
    bgClass: 'bg-red-500/5',
    borderClass: 'border-red-500/20',
    iconClass: 'text-red-600 dark:text-red-400',
  },
}

interface LevelSectionProps {
  level: SkillLevel
  snippets: Snippet[]
  startDelay?: number
}

function LevelSection({ level, snippets, startDelay = 0 }: LevelSectionProps) {
  const config = levelConfigs[level]
  const Icon = config.icon

  if (snippets.length === 0) return null

  return (
    <section className={cn('rounded-xl p-4 md:p-6 border', config.bgClass, config.borderClass)}>
      <div className="flex items-center gap-3 mb-6">
        <div className={cn('p-2 rounded-lg bg-background', config.borderClass, 'border')}>
          <Icon className={cn('h-5 w-5', config.iconClass)} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{config.label}</h2>
          <p className="text-sm text-muted-foreground">
            {snippets.length} {snippets.length === 1 ? 'сниппет' : snippets.length < 5 ? 'сниппета' : 'сниппетов'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {snippets.map((snippet, index) => (
          <AnimatedCard key={snippet.id} delay={startDelay + index * 50}>
            <SnippetCard snippet={snippet} />
          </AnimatedCard>
        ))}
      </div>
    </section>
  )
}

interface SnippetsByLevelProps {
  snippets: Snippet[]
}

export function SnippetsByLevel({ snippets }: SnippetsByLevelProps) {
  const byLevel: Record<SkillLevel, Snippet[]> = {
    beginner: snippets.filter((s) => s.level === 'beginner'),
    intermediate: snippets.filter((s) => s.level === 'intermediate'),
    advanced: snippets.filter((s) => s.level === 'advanced'),
  }

  let delay = 0
  const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced']

  return (
    <div className="space-y-8">
      {levels.map((level) => {
        const levelSnippets = byLevel[level]
        const section = (
          <LevelSection
            key={level}
            level={level}
            snippets={levelSnippets}
            startDelay={delay}
          />
        )
        delay += levelSnippets.length * 50
        return section
      })}
    </div>
  )
}
