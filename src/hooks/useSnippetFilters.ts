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

export type SortOption = 'default' | 'title-asc' | 'title-desc' | 'level-asc' | 'level-desc'

const levelOrder: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
}

function sortSnippets(snippets: Snippet[], sort: SortOption): Snippet[] {
  if (sort === 'default') return snippets
  const sorted = [...snippets]
  switch (sort) {
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case 'level-asc':
      return sorted.sort((a, b) => levelOrder[a.level] - levelOrder[b.level])
    case 'level-desc':
      return sorted.sort((a, b) => levelOrder[b.level] - levelOrder[a.level])
  }
}

interface UseSnippetFiltersOptions {
  syncWithUrl?: boolean
}

export function useSnippetFilters(options: UseSnippetFiltersOptions = {}) {
  const { syncWithUrl = false } = options
  const [searchParams, setSearchParams] = useSearchParams()
  const [levelFilter, setLevelFilter] = useState<SkillLevel | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('default')

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

  // Apply level filter and sorting
  const filtered = useMemo(() => {
    const byLevel = levelFilter === 'all' ? snippetsToShow : snippetsToShow.filter((s) => s.level === levelFilter)
    return sortSnippets(byLevel, sortBy)
  }, [snippetsToShow, levelFilter, sortBy])

  return {
    searchQuery,
    setSearchQuery,
    levelFilter,
    setLevelFilter,
    categoryFilter,
    handleCategoryChange,
    sortBy,
    setSortBy,
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
