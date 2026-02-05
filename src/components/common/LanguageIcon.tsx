import { cn } from '@/lib/utils'
import type { Language } from '@/types'

interface LanguageIconProps {
  language: Language | string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4 text-[10px]',
  md: 'w-6 h-6 text-xs',
  lg: 'w-8 h-8 text-sm',
  xl: 'w-12 h-12 text-base',
}

const languageConfig: Record<string, { bg: string; text: string; label: string }> = {
  ts: {
    bg: 'bg-blue-500/20 dark:bg-blue-500/30',
    text: 'text-blue-600 dark:text-blue-400',
    label: 'TS',
  },
  tsx: {
    bg: 'bg-blue-500/20 dark:bg-blue-500/30',
    text: 'text-blue-600 dark:text-blue-400',
    label: 'TSX',
  },
  typescript: {
    bg: 'bg-blue-500/20 dark:bg-blue-500/30',
    text: 'text-blue-600 dark:text-blue-400',
    label: 'TS',
  },
  js: {
    bg: 'bg-yellow-500/20 dark:bg-yellow-500/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    label: 'JS',
  },
  jsx: {
    bg: 'bg-yellow-500/20 dark:bg-yellow-500/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    label: 'JSX',
  },
  javascript: {
    bg: 'bg-yellow-500/20 dark:bg-yellow-500/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    label: 'JS',
  },
  react: {
    bg: 'bg-cyan-500/20 dark:bg-cyan-500/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    label: 'R',
  },
  css: {
    bg: 'bg-purple-500/20 dark:bg-purple-500/30',
    text: 'text-purple-600 dark:text-purple-400',
    label: 'CSS',
  },
  html: {
    bg: 'bg-orange-500/20 dark:bg-orange-500/30',
    text: 'text-orange-600 dark:text-orange-400',
    label: 'HTML',
  },
  json: {
    bg: 'bg-gray-500/20 dark:bg-gray-500/30',
    text: 'text-gray-600 dark:text-gray-400',
    label: 'JSON',
  },
  bash: {
    bg: 'bg-green-500/20 dark:bg-green-500/30',
    text: 'text-green-600 dark:text-green-400',
    label: '$',
  },
}

const defaultConfig = {
  bg: 'bg-muted',
  text: 'text-muted-foreground',
  label: '?',
}

export function LanguageIcon({ language, size = 'md', className }: LanguageIconProps) {
  const config = languageConfig[language.toLowerCase()] ?? defaultConfig

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-md font-mono font-bold',
        sizeClasses[size],
        config.bg,
        config.text,
        className
      )}
      title={language.toUpperCase()}
    >
      {config.label}
    </div>
  )
}

// Large decorative icon for floating animation
export function LanguageIconLarge({
  language,
  className,
}: {
  language: string
  className?: string
}) {
  const config = languageConfig[language.toLowerCase()] ?? defaultConfig

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl font-mono font-bold w-16 h-16 text-2xl opacity-60',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </div>
  )
}
