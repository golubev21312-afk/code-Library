import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from './useDebounce'
import {
  getSnippetsByCategory,
  getCategories,
  getSnippetsStats,
  searchSnippets,
} from '@/data/snippets'
import type { Snippet, SkillLevel } from '@/types'

interface UseSnippetFiltersOptions {
  syncWithUrl?: boolean
}

export function useSnippetFilters(options: UseSnippetFiltersOptions = {}) {
  const { syncWithUrl = false } = options
  const [searchParams, setSearchParams] = useSearchParams()
  const [levelFilter, setLevelFilter] = useState<SkillLevel | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearch = useDebounce(searchQuery, 200)

  const snippetsByCategory = useMemo(() => getSnippetsByCategory(), [])
  const categories = useMemo(() => getCategories(), [])
  const stats = useMemo(() => getSnippetsStats(), [])

  // Sync category from URL on mount
  useEffect(() => {
    if (!syncWithUrl) return
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setCategoryFilter(categoryFromUrl)
    }
  }, [searchParams, categories, syncWithUrl])

  const handleCategoryChange = (category: string | 'all') => {
    setCategoryFilter(category)
    if (syncWithUrl) {
      if (category === 'all') {
        searchParams.delete('category')
      } else {
        searchParams.set('category', category)
      }
      setSearchParams(searchParams)
    }
  }

  // Get snippets based on search or filters
  const snippetsToShow = useMemo(() => {
    if (debouncedSearch.trim()) return searchSnippets(debouncedSearch)
    if (categoryFilter === 'all') return Array.from(snippetsByCategory.values()).flat()
    return snippetsByCategory.get(categoryFilter) ?? []
  }, [debouncedSearch, categoryFilter, snippetsByCategory])

  // Apply level filter
  const filtered = useMemo(
    () => levelFilter === 'all' ? snippetsToShow : snippetsToShow.filter((s) => s.level === levelFilter),
    [snippetsToShow, levelFilter]
  )

  return {
    searchQuery,
    setSearchQuery,
    levelFilter,
    setLevelFilter,
    categoryFilter,
    handleCategoryChange,
    categories,
    stats,
    filtered,
  }
}

export function useFilteredSnippets(snippets: Snippet[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<SkillLevel | 'all'>('all')

  const debouncedSearch = useDebounce(searchQuery, 200)

  const filtered = useMemo(() => {
    let result = snippets

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (levelFilter !== 'all') {
      result = result.filter((s) => s.level === levelFilter)
    }

    return result
  }, [snippets, debouncedSearch, levelFilter])

  return {
    searchQuery,
    setSearchQuery,
    levelFilter,
    setLevelFilter,
    filtered,
  }
}
