import { htmlTags, htmlCategories } from '../tags/html-tags'
import { cssProperties, cssCategories } from '../tags/css-properties'
import { popularTags } from '../tags/popular-tags'

describe('htmlTags data', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(htmlTags)).toBe(true)
    expect(htmlTags.length).toBeGreaterThan(0)
  })

  it('each tag has required fields', () => {
    for (const tag of htmlTags) {
      expect(typeof tag.tag).toBe('string')
      expect(tag.tag.length).toBeGreaterThan(0)
      expect(typeof tag.description).toBe('string')
      expect(typeof tag.example).toBe('string')
      expect(typeof tag.category).toBe('string')
    }
  })

  it('all categories are valid', () => {
    const validCategories = Object.keys(htmlCategories)
    for (const tag of htmlTags) {
      expect(validCategories).toContain(tag.category)
    }
  })

  it('has unique tag names', () => {
    const names = htmlTags.map((t) => t.tag)
    expect(new Set(names).size).toBe(names.length)
  })

  it('htmlCategories has labels for all used categories', () => {
    const usedCategories = new Set(htmlTags.map((t) => t.category))
    for (const cat of usedCategories) {
      expect(htmlCategories[cat]).toBeDefined()
      expect(typeof htmlCategories[cat]).toBe('string')
    }
  })
})

describe('cssProperties data', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(cssProperties)).toBe(true)
    expect(cssProperties.length).toBeGreaterThan(0)
  })

  it('each property has required fields', () => {
    for (const prop of cssProperties) {
      expect(typeof prop.property).toBe('string')
      expect(prop.property.length).toBeGreaterThan(0)
      expect(typeof prop.description).toBe('string')
      expect(typeof prop.example).toBe('string')
      expect(typeof prop.category).toBe('string')
    }
  })

  it('all categories are valid', () => {
    const validCategories = Object.keys(cssCategories)
    for (const prop of cssProperties) {
      expect(validCategories).toContain(prop.category)
    }
  })

  it('has unique property names', () => {
    const names = cssProperties.map((p) => p.property)
    expect(new Set(names).size).toBe(names.length)
  })

  it('cssCategories has labels for all used categories', () => {
    const usedCategories = new Set(cssProperties.map((p) => p.category))
    for (const cat of usedCategories) {
      expect(cssCategories[cat]).toBeDefined()
      expect(typeof cssCategories[cat]).toBe('string')
    }
  })
})

describe('popularTags data', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(popularTags)).toBe(true)
    expect(popularTags.length).toBeGreaterThan(0)
  })

  it('each tag has required fields', () => {
    for (const tag of popularTags) {
      expect(typeof tag.name).toBe('string')
      expect(['html', 'css']).toContain(tag.type)
      expect(typeof tag.title).toBe('string')
      expect(typeof tag.description).toBe('string')
      expect(typeof tag.details).toBe('string')
      expect(typeof tag.example).toBe('string')
    }
  })

  it('tips is optional but always an array when present', () => {
    for (const tag of popularTags) {
      if (tag.tips !== undefined) {
        expect(Array.isArray(tag.tips)).toBe(true)
        for (const tip of tag.tips) {
          expect(typeof tip).toBe('string')
        }
      }
    }
  })

  it('contains both html and css type tags', () => {
    const types = new Set(popularTags.map((t) => t.type))
    expect(types.has('html')).toBe(true)
    expect(types.has('css')).toBe(true)
  })

  it('has unique name+type combos', () => {
    const combos = popularTags.map((t) => `${t.type}-${t.name}`)
    expect(new Set(combos).size).toBe(combos.length)
  })
})
