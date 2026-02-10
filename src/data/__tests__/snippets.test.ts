import {
  getAllSnippets,
  getSnippetById,
  searchSnippets,
  getCategories,
  getSnippetsStats,
  getSnippetsByCategory,
  getSnippetsByTag,
} from '../snippets/index'

describe('snippets data', () => {
  describe('getAllSnippets', () => {
    it('returns an array', () => {
      const all = getAllSnippets()
      expect(Array.isArray(all)).toBe(true)
    })

    it('returns non-empty array', () => {
      const all = getAllSnippets()
      expect(all.length).toBeGreaterThan(0)
    })

    it('each snippet has required fields', () => {
      const all = getAllSnippets()
      for (const snippet of all) {
        expect(snippet).toHaveProperty('id')
        expect(snippet).toHaveProperty('title')
        expect(snippet).toHaveProperty('description')
        expect(snippet).toHaveProperty('code')
        expect(snippet).toHaveProperty('language')
        expect(snippet).toHaveProperty('level')
        expect(snippet).toHaveProperty('tags')
        expect(Array.isArray(snippet.tags)).toBe(true)
      }
    })

    it('all snippets have unique ids', () => {
      const all = getAllSnippets()
      const ids = all.map((s) => s.id)
      const seen = new Set<string>()
      const duplicates: string[] = []
      for (const id of ids) {
        if (seen.has(id)) duplicates.push(id)
        seen.add(id)
      }
      // Report any duplicates found in the data
      expect(duplicates).toEqual([])
    })
  })

  describe('getSnippetById', () => {
    it('returns a snippet when found', () => {
      const all = getAllSnippets()
      const first = all[0]
      const found = getSnippetById(first.id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(first.id)
      expect(found?.title).toBe(first.title)
    })

    it('returns undefined when not found', () => {
      const found = getSnippetById('non-existent-id-12345')
      expect(found).toBeUndefined()
    })
  })

  describe('searchSnippets', () => {
    it('returns all snippets for empty query', () => {
      const result = searchSnippets('')
      const all = getAllSnippets()
      expect(result.length).toBe(all.length)
    })

    it('searches by title', () => {
      const all = getAllSnippets()
      const target = all[0]
      // Use first word of the title for search
      const searchWord = target.title.split(/\s+/)[0]
      const result = searchSnippets(searchWord)
      expect(result.length).toBeGreaterThan(0)
      expect(result.some((s) => s.id === target.id)).toBe(true)
    })

    it('searches by tags', () => {
      const all = getAllSnippets()
      // Find a snippet with tags
      const withTags = all.find((s) => s.tags.length > 0)
      if (!withTags) return

      const tag = withTags.tags[0]
      const result = searchSnippets(tag)
      expect(result.length).toBeGreaterThan(0)
      expect(result.some((s) => s.tags.includes(tag))).toBe(true)
    })

    it('is case-insensitive', () => {
      const all = getAllSnippets()
      const target = all[0]
      const upper = searchSnippets(target.title.toUpperCase())
      const lower = searchSnippets(target.title.toLowerCase())
      expect(upper.length).toBe(lower.length)
    })

    it('returns empty array for garbage query', () => {
      const result = searchSnippets('xyzxyzxyz999notfound')
      expect(result).toHaveLength(0)
    })
  })

  describe('getCategories', () => {
    it('returns an array of strings', () => {
      const categories = getCategories()
      expect(Array.isArray(categories)).toBe(true)
      expect(categories.length).toBeGreaterThan(0)
      for (const cat of categories) {
        expect(typeof cat).toBe('string')
      }
    })

    it('categories match getSnippetsByCategory keys', () => {
      const categories = getCategories()
      const byCategory = getSnippetsByCategory()
      const keys = Array.from(byCategory.keys())
      expect(categories).toEqual(keys)
    })
  })

  describe('getSnippetsStats', () => {
    it('returns correct total', () => {
      const stats = getSnippetsStats()
      const all = getAllSnippets()
      expect(stats.total).toBe(all.length)
    })

    it('returns correct category count', () => {
      const stats = getSnippetsStats()
      const categories = getCategories()
      expect(stats.categories).toBe(categories.length)
    })

    it('byCategory sums to total', () => {
      const stats = getSnippetsStats()
      const sum = Object.values(stats.byCategory).reduce(
        (acc, val) => acc + val,
        0
      )
      expect(sum).toBe(stats.total)
    })

    it('byLevel sums to total', () => {
      const stats = getSnippetsStats()
      const sum =
        stats.byLevel.beginner +
        stats.byLevel.intermediate +
        stats.byLevel.advanced
      expect(sum).toBe(stats.total)
    })

    it('byLevel values are non-negative', () => {
      const stats = getSnippetsStats()
      expect(stats.byLevel.beginner).toBeGreaterThanOrEqual(0)
      expect(stats.byLevel.intermediate).toBeGreaterThanOrEqual(0)
      expect(stats.byLevel.advanced).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getSnippetsByCategory', () => {
    it('returns a Map', () => {
      const result = getSnippetsByCategory()
      expect(result instanceof Map).toBe(true)
    })

    it('each category has non-empty array of snippets', () => {
      const result = getSnippetsByCategory()
      for (const [, snippets] of result) {
        expect(snippets.length).toBeGreaterThan(0)
      }
    })
  })

  describe('getSnippetsByTag', () => {
    it('returns snippets for existing category', () => {
      const categories = getCategories()
      const result = getSnippetsByTag(categories[0])
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns empty array for non-existent category', () => {
      const result = getSnippetsByTag('nonexistent-category-xyz')
      expect(result).toEqual([])
    })
  })
})
