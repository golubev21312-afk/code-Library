import type { Snippet } from '@/types'

/**
 * Тип модуля со сниппетами
 * Каждый файл должен экспортировать массив сниппетов с именем *Snippets
 */
interface SnippetModule {
  [key: string]: Snippet[] | unknown
}

/**
 * Результат glob импорта
 */
type GlobModules = Record<string, SnippetModule>

/**
 * Извлекает категорию из пути файла
 * './typescript/utility-types.ts' → 'typescript'
 */
function extractCategory(path: string): string {
  const match = path.match(/^\.\/([^/]+)\//)
  return match ? match[1] : 'uncategorized'
}

/**
 * Находит массив сниппетов в модуле
 * Ищет экспорт с суффиксом 'Snippets' или первый массив
 */
function findSnippetsArray(module: SnippetModule): Snippet[] {
  // Ищем экспорт с именем *Snippets
  for (const [key, value] of Object.entries(module)) {
    if (key.endsWith('Snippets') && Array.isArray(value)) {
      return value as Snippet[]
    }
  }

  // Fallback: ищем любой массив
  for (const value of Object.values(module)) {
    if (Array.isArray(value) && value.length > 0 && 'id' in value[0]) {
      return value as Snippet[]
    }
  }

  return []
}

/**
 * Загружает все модули сниппетов через Vite glob import
 * eager: true — синхронная загрузка всех модулей
 */
const snippetModules: GlobModules = import.meta.glob<SnippetModule>(
  './**/*.ts',
  { eager: true }
)

/**
 * Кэш для сниппетов по категориям
 */
let cachedSnippetsByCategory: Map<string, Snippet[]> | null = null
let cachedAllSnippets: Snippet[] | null = null

/**
 * Получить все сниппеты сгруппированные по категориям
 * @returns Map где ключ — категория, значение — массив сниппетов
 */
export function getSnippetsByCategory(): Map<string, Snippet[]> {
  if (cachedSnippetsByCategory) {
    return cachedSnippetsByCategory
  }

  const result = new Map<string, Snippet[]>()

  for (const [path, module] of Object.entries(snippetModules)) {
    // Пропускаем index.ts
    if (path.includes('index.ts')) continue

    try {
      const category = extractCategory(path)
      const snippets = findSnippetsArray(module)

      if (snippets.length === 0) continue

      const existing = result.get(category) ?? []
      result.set(category, [...existing, ...snippets])
    } catch (error) {
      console.error(`[snippets] Error processing ${path}:`, error)
    }
  }

  cachedSnippetsByCategory = result
  return result
}

/**
 * Получить все сниппеты одним массивом
 */
export function getAllSnippets(): Snippet[] {
  if (cachedAllSnippets) {
    return cachedAllSnippets
  }

  const byCategory = getSnippetsByCategory()
  const all: Snippet[] = []

  for (const snippets of byCategory.values()) {
    all.push(...snippets)
  }

  cachedAllSnippets = all
  return all
}

/**
 * Получить сниппеты конкретной категории
 */
export function getSnippetsByTag(category: string): Snippet[] {
  return getSnippetsByCategory().get(category) ?? []
}

/**
 * Получить один сниппет по id
 */
export function getSnippetById(id: string): Snippet | undefined {
  return getAllSnippets().find((s) => s.id === id)
}

/**
 * Получить список всех категорий
 */
export function getCategories(): string[] {
  return Array.from(getSnippetsByCategory().keys())
}

/**
 * Поиск сниппетов по тексту (title, description, tags)
 */
export function searchSnippets(query: string): Snippet[] {
  const q = query.toLowerCase().trim()
  if (!q) return getAllSnippets()

  return getAllSnippets().filter((snippet) => {
    return (
      snippet.title.toLowerCase().includes(q) ||
      snippet.description.toLowerCase().includes(q) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(q))
    )
  })
}

/**
 * Статистика по сниппетам
 */
export function getSnippetsStats() {
  const all = getAllSnippets()
  const byCategory = getSnippetsByCategory()

  return {
    total: all.length,
    categories: byCategory.size,
    byCategory: Object.fromEntries(
      Array.from(byCategory.entries()).map(([cat, snippets]) => [
        cat,
        snippets.length,
      ])
    ),
    byLevel: {
      beginner: all.filter((s) => s.level === 'beginner').length,
      intermediate: all.filter((s) => s.level === 'intermediate').length,
      advanced: all.filter((s) => s.level === 'advanced').length,
    },
  }
}
