import { renderHook, act } from '@testing-library/react'
import type { Snippet } from '@/types'

// Mock data
const mockSnippets: Snippet[] = [
  {
    id: 'use-state',
    title: 'useState Hook',
    description: 'Хук для управления состоянием',
    code: 'const [x, setX] = useState(0)',
    language: 'tsx',
    level: 'beginner',
    tags: ['react', 'hooks'],
  },
  {
    id: 'memo',
    title: 'React.memo',
    description: 'Мемоизация компонентов',
    code: 'export default memo(MyComponent)',
    language: 'tsx',
    level: 'intermediate',
    tags: ['react', 'performance'],
  },
  {
    id: 'generics',
    title: 'TypeScript Generics',
    description: 'Дженерики в TypeScript',
    code: 'function identity<T>(arg: T): T { return arg }',
    language: 'ts',
    level: 'advanced',
    tags: ['typescript', 'generics'],
  },
]

const mockSnippetsByCategory = new Map([
  ['react', [mockSnippets[0], mockSnippets[1]]],
  ['typescript', [mockSnippets[2]]],
])

// Mock modules
vi.mock('@/data/snippets', () => ({
  getSnippetsByCategory: () => mockSnippetsByCategory,
  getCategories: () => ['react', 'typescript'],
  getSnippetsStats: () => ({
    total: 3,
    categories: 2,
    byCategory: { react: 2, typescript: 1 },
    byLevel: { beginner: 1, intermediate: 1, advanced: 1 },
  }),
  searchSnippets: (query: string) => {
    const q = query.toLowerCase()
    return mockSnippets.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    )
  },
}))

const mockSearchParams = new URLSearchParams()
const mockSetSearchParams = vi.fn()

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}))

import { useSnippetFilters, useFilteredSnippets } from '../useSnippetFilters'

describe('useSnippetFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockSearchParams.delete('category')
    mockSetSearchParams.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns all snippets by default', () => {
    const { result } = renderHook(() => useSnippetFilters())
    expect(result.current.filtered).toHaveLength(3)
  })

  it('returns categories', () => {
    const { result } = renderHook(() => useSnippetFilters())
    expect(result.current.categories).toEqual(['react', 'typescript'])
  })

  it('returns stats', () => {
    const { result } = renderHook(() => useSnippetFilters())
    expect(result.current.stats.total).toBe(3)
    expect(result.current.stats.categories).toBe(2)
  })

  it('filters by category', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.handleCategoryChange('react')
    })

    expect(result.current.filtered).toHaveLength(2)
    expect(result.current.filtered.every((s) => s.tags.includes('react'))).toBe(true)
  })

  it('filters by level', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.setLevelFilter('beginner')
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].id).toBe('use-state')
  })

  it('filters by level "advanced"', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.setLevelFilter('advanced')
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].id).toBe('generics')
  })

  it('combines category and level filters', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.handleCategoryChange('react')
      result.current.setLevelFilter('beginner')
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].id).toBe('use-state')
  })

  it('searches with debounce', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.setSearchQuery('memo')
    })

    // Before debounce, still shows all
    expect(result.current.filtered).toHaveLength(3)

    act(() => {
      vi.advanceTimersByTime(200)
    })

    // After debounce, filtered by search
    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].id).toBe('memo')
  })

  it('sorts by title ascending', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.setSortBy('title-asc')
    })

    const titles = result.current.filtered.map((s) => s.title)
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)))
  })

  it('sorts by title descending', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.setSortBy('title-desc')
    })

    const titles = result.current.filtered.map((s) => s.title)
    expect(titles).toEqual([...titles].sort((a, b) => b.localeCompare(a)))
  })

  it('sorts by level ascending', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.setSortBy('level-asc')
    })

    const levels = result.current.filtered.map((s) => s.level)
    expect(levels).toEqual(['beginner', 'intermediate', 'advanced'])
  })

  it('sorts by level descending', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.setSortBy('level-desc')
    })

    const levels = result.current.filtered.map((s) => s.level)
    expect(levels).toEqual(['advanced', 'intermediate', 'beginner'])
  })

  it('resets to all when category set to "all"', () => {
    const { result } = renderHook(() => useSnippetFilters())

    act(() => {
      result.current.handleCategoryChange('react')
    })
    expect(result.current.filtered).toHaveLength(2)

    act(() => {
      result.current.handleCategoryChange('all')
    })
    expect(result.current.filtered).toHaveLength(3)
  })
})

describe('useFilteredSnippets', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns all snippets by default', () => {
    const { result } = renderHook(() => useFilteredSnippets(mockSnippets))
    expect(result.current.filtered).toHaveLength(3)
  })

  it('filters by search query with debounce', () => {
    const { result } = renderHook(() => useFilteredSnippets(mockSnippets))

    act(() => {
      result.current.setSearchQuery('generics')
    })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].id).toBe('generics')
  })

  it('filters by tag', () => {
    const { result } = renderHook(() => useFilteredSnippets(mockSnippets))

    act(() => {
      result.current.setSearchQuery('performance')
    })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].id).toBe('memo')
  })

  it('filters by level', () => {
    const { result } = renderHook(() => useFilteredSnippets(mockSnippets))

    act(() => {
      result.current.setLevelFilter('intermediate')
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].id).toBe('memo')
  })

  it('combines search and level filters', () => {
    const { result } = renderHook(() => useFilteredSnippets(mockSnippets))

    act(() => {
      result.current.setSearchQuery('react')
      result.current.setLevelFilter('beginner')
    })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].id).toBe('use-state')
  })
})
