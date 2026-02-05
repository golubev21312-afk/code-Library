export type Language = 'ts' | 'tsx' | 'js' | 'jsx' | 'css' | 'html' | 'json' | 'bash'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Snippet {
  /** Уникальный идентификатор в kebab-case */
  id: string
  /** Название сниппета */
  title: string
  /** Описание на русском (1-3 предложения) */
  description: string
  /** Код примера */
  code: string
  /** Язык для подсветки синтаксиса */
  language: Language
  /** Уровень сложности */
  level: SkillLevel
  /** Теги для поиска и фильтрации */
  tags: string[]
  /** Превью кода (короткая версия для карточки) */
  preview?: string
  /** Почему это актуально в 2026 году */
  whyRelevant2026?: string
  /** Связанные сниппеты (массив id) */
  related?: string[]
}

export interface SnippetCategory {
  id: string
  title: string
  description: string
  icon?: string
  snippets: Snippet[]
}
