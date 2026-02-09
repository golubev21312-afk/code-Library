import { useState } from 'react'
import { usePageMeta } from '@/hooks/usePageMeta'
import { Code2, Palette, ChevronDown, Copy, Check, Star, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CodeBlock } from '@/components/code/CodeBlock'
import { htmlTags, htmlCategories, type HtmlTag } from '@/data/tags/html-tags'
import { cssProperties, cssCategories, type CssProperty } from '@/data/tags/css-properties'
import { popularTags, type PopularTag } from '@/data/tags/popular-tags'
import { cn } from '@/lib/utils'

// Компонент карточки популярного тега (подробный)
function PopularTagCard({ name, type, title, description, details, example, tips }: PopularTag) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example)
      setCopied(true)
      toast.success('Код скопирован')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  const isHtml = type === 'html'
  const bgColor = isHtml ? 'bg-orange-500/10' : 'bg-purple-500/10'
  const textColor = isHtml
    ? 'text-orange-600 dark:text-orange-400'
    : 'text-purple-600 dark:text-purple-400'

  return (
    <Card className={cn(
      "transition-all duration-300",
      isOpen ? "ring-2 ring-primary/20" : "hover:shadow-lg hover:border-primary/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <code className={cn(
              "px-2.5 py-1.5 rounded font-mono text-sm font-bold shrink-0",
              bgColor, textColor
            )}>
              {isHtml ? `<${name}>` : name}
            </code>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {isHtml ? 'HTML' : 'CSS'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Подробное описание */}
        <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed bg-muted/30 rounded-lg p-4">
          {details}
        </div>

        {/* Кнопка раскрытия примера */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Пример кода
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>

        {/* Пример кода */}
        {isOpen && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <CodeBlock
                code={example}
                language={isHtml ? 'html' : 'css'}
                showLineNumbers
                className="max-h-[400px] overflow-auto"
              />
            </div>

            {/* Советы */}
            {tips && tips.length > 0 && (
              <div className="rounded-lg border bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium text-sm">Советы</span>
                </div>
                <ul className="space-y-1">
                  {tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Компонент карточки HTML тега
function HtmlTagCard({ tag, description, example }: HtmlTag) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example)
      setCopied(true)
      toast.success('Код скопирован')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <code className="px-2 py-1 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono text-sm font-semibold">
            &lt;{tag}&gt;
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Пример кода</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )} />
        </Button>
        {isOpen && (
          <div className="mt-2 animate-fade-in">
            <CodeBlock
              code={example}
              language="html"
              className="max-h-[300px] overflow-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Компонент карточки CSS свойства
function CssPropertyCard({ property, description, example }: CssProperty) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example)
      setCopied(true)
      toast.success('Код скопирован')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <code className="px-2 py-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-sm font-semibold">
            {property}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Пример кода</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )} />
        </Button>
        {isOpen && (
          <div className="mt-2 animate-fade-in">
            <CodeBlock
              code={example}
              language="css"
              className="max-h-[300px] overflow-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function TagsPage() {
  usePageMeta({ title: 'Теги', description: 'Справочник HTML-тегов и CSS-свойств с примерами' })

  const [htmlFilter, setHtmlFilter] = useState<HtmlTag['category'] | 'all'>('all')
  const [cssFilter, setCssFilter] = useState<CssProperty['category'] | 'all'>('all')
  const [popularFilter, setPopularFilter] = useState<'all' | 'html' | 'css'>('all')

  const filteredHtml = htmlFilter === 'all'
    ? htmlTags
    : htmlTags.filter(t => t.category === htmlFilter)

  const filteredCss = cssFilter === 'all'
    ? cssProperties
    : cssProperties.filter(p => p.category === cssFilter)

  const filteredPopular = popularFilter === 'all'
    ? popularTags
    : popularTags.filter(t => t.type === popularFilter)

  return (
    <div className="container py-6">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Справочник тегов</h1>
          <p className="text-muted-foreground mt-1">
            {htmlTags.length} HTML тегов • {cssProperties.length} CSS свойств • {popularTags.length} подробных примеров
          </p>
        </div>

        {/* Popular Tags Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-semibold">Популярные теги</h2>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={popularFilter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setPopularFilter('all')}
              >
                Все
              </Badge>
              <Badge
                variant={popularFilter === 'html' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setPopularFilter('html')}
              >
                HTML
              </Badge>
              <Badge
                variant={popularFilter === 'css' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setPopularFilter('css')}
              >
                CSS
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Самые используемые теги и свойства с подробными примерами и советами
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredPopular.map((tag) => (
              <PopularTagCard key={`${tag.type}-${tag.name}`} {...tag} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Полный справочник
            </span>
          </div>
        </div>

        {/* Full Reference Tabs */}
        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="html" className="gap-2">
              <Code2 className="h-4 w-4" />
              HTML ({htmlTags.length})
            </TabsTrigger>
            <TabsTrigger value="css" className="gap-2">
              <Palette className="h-4 w-4" />
              CSS ({cssProperties.length})
            </TabsTrigger>
          </TabsList>

          {/* HTML Tab */}
          <TabsContent value="html" className="mt-6 space-y-6">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={htmlFilter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setHtmlFilter('all')}
              >
                Все ({htmlTags.length})
              </Badge>
              {(Object.keys(htmlCategories) as HtmlTag['category'][]).map(cat => (
                <Badge
                  key={cat}
                  variant={htmlFilter === cat ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setHtmlFilter(cat)}
                >
                  {htmlCategories[cat]} ({htmlTags.filter(t => t.category === cat).length})
                </Badge>
              ))}
            </div>

            {/* Tags list */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHtml.map((tag) => (
                <HtmlTagCard key={tag.tag} {...tag} />
              ))}
            </div>
          </TabsContent>

          {/* CSS Tab */}
          <TabsContent value="css" className="mt-6 space-y-6">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={cssFilter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setCssFilter('all')}
              >
                Все ({cssProperties.length})
              </Badge>
              {(Object.keys(cssCategories) as CssProperty['category'][]).map(cat => (
                <Badge
                  key={cat}
                  variant={cssFilter === cat ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setCssFilter(cat)}
                >
                  {cssCategories[cat]} ({cssProperties.filter(p => p.category === cat).length})
                </Badge>
              ))}
            </div>

            {/* Properties list */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCss.map((prop) => (
                <CssPropertyCard key={prop.property} {...prop} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
