import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, Copy } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { toast } from 'sonner'
import { useThemeStore, getResolvedTheme } from '@/store/themeStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const codeBlockVariants = cva(
  'relative rounded-lg border overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-muted/50',
        ghost: 'border-none bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const headerVariants = cva(
  'flex items-center justify-between px-4 py-2 border-b',
  {
    variants: {
      variant: {
        default: 'bg-muted/80',
        ghost: 'bg-transparent border-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type SupportedLanguage = 'tsx' | 'ts' | 'typescript' | 'js' | 'javascript' | 'css' | 'html' | 'json' | 'bash' | 'shell'

interface CodeBlockProps extends VariantProps<typeof codeBlockVariants> {
  code: string
  language: SupportedLanguage | string
  title?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  variant,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const theme = useThemeStore((state) => state.theme)
  const resolvedTheme = getResolvedTheme(theme)

  const syntaxTheme = resolvedTheme === 'dark' ? oneDark : oneLight

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Код скопирован')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  const normalizedLanguage = normalizeLanguage(language)

  return (
    <div className={cn(codeBlockVariants({ variant }), className)}>
      <div className={headerVariants({ variant })}>
          <span className="text-sm font-medium text-muted-foreground">
            {title ?? normalizedLanguage}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
            aria-label={copied ? 'Код скопирован' : 'Копировать код'}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      <SyntaxHighlighter
        language={normalizedLanguage}
        style={syntaxTheme}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem',
        }}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          color: resolvedTheme === 'dark' ? '#636d83' : '#9ca3af',
          userSelect: 'none',
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  )
}

function normalizeLanguage(lang: string): string {
  const map: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    shell: 'bash',
  }
  return map[lang] || lang
}
