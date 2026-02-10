import { renderHook } from '@testing-library/react'
import { usePageMeta } from '../usePageMeta'

describe('usePageMeta', () => {
  const originalTitle = document.title

  beforeEach(() => {
    document.title = 'Original Title'
    // Remove all meta tags we might create
    document
      .querySelectorAll('meta[name="description"], meta[property]')
      .forEach((el) => el.remove())
  })

  afterEach(() => {
    document.title = originalTitle
  })

  it('updates document.title with site name suffix', () => {
    renderHook(() => usePageMeta({ title: 'Сниппеты' }))
    expect(document.title).toBe('Сниппеты — Code Library')
  })

  it('creates description meta tag with default value', () => {
    renderHook(() => usePageMeta({ title: 'Test' }))

    const meta = document.querySelector('meta[name="description"]')
    expect(meta).not.toBeNull()
    expect(meta?.getAttribute('content')).toBe(
      'Библиотека 215+ сниппетов для React, TypeScript, JavaScript, CSS и HTML'
    )
  })

  it('creates description meta tag with custom value', () => {
    renderHook(() =>
      usePageMeta({ title: 'Test', description: 'Custom description' })
    )

    const meta = document.querySelector('meta[name="description"]')
    expect(meta?.getAttribute('content')).toBe('Custom description')
  })

  it('creates og:title meta tag', () => {
    renderHook(() => usePageMeta({ title: 'Page Title' }))

    const meta = document.querySelector('meta[property="og:title"]')
    expect(meta?.getAttribute('content')).toBe('Page Title')
  })

  it('creates og:title with custom ogTitle', () => {
    renderHook(() =>
      usePageMeta({ title: 'Page Title', ogTitle: 'OG Custom Title' })
    )

    const meta = document.querySelector('meta[property="og:title"]')
    expect(meta?.getAttribute('content')).toBe('OG Custom Title')
  })

  it('creates og:description meta tag', () => {
    renderHook(() =>
      usePageMeta({
        title: 'Test',
        description: 'My desc',
        ogDescription: 'OG desc',
      })
    )

    const meta = document.querySelector('meta[property="og:description"]')
    expect(meta?.getAttribute('content')).toBe('OG desc')
  })

  it('creates og:type meta tag with default "website"', () => {
    renderHook(() => usePageMeta({ title: 'Test' }))

    const meta = document.querySelector('meta[property="og:type"]')
    expect(meta?.getAttribute('content')).toBe('website')
  })

  it('creates og:type meta tag with custom value', () => {
    renderHook(() => usePageMeta({ title: 'Test', ogType: 'article' }))

    const meta = document.querySelector('meta[property="og:type"]')
    expect(meta?.getAttribute('content')).toBe('article')
  })

  it('creates og:site_name meta tag', () => {
    renderHook(() => usePageMeta({ title: 'Test' }))

    const meta = document.querySelector('meta[property="og:site_name"]')
    expect(meta?.getAttribute('content')).toBe('Code Library')
  })

  it('restores previous title on unmount', () => {
    document.title = 'Before Hook'
    const { unmount } = renderHook(() => usePageMeta({ title: 'During Hook' }))

    expect(document.title).toBe('During Hook — Code Library')
    unmount()
    expect(document.title).toBe('Before Hook')
  })

  it('updates existing meta tags instead of creating duplicates', () => {
    const { rerender } = renderHook(
      ({ title }) => usePageMeta({ title }),
      { initialProps: { title: 'First' } }
    )

    rerender({ title: 'Second' })

    const metas = document.querySelectorAll('meta[property="og:title"]')
    expect(metas.length).toBe(1)
    expect(metas[0].getAttribute('content')).toBe('Second')
  })
})
