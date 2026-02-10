import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HeroSection } from '../home/HeroSection'

vi.mock('@/data/snippets', () => ({
  getSnippetsStats: () => ({
    total: 42,
    categories: 5,
    byCategory: {},
    byLevel: {},
    byLanguage: {},
  }),
}))

vi.mock('@/data/tags/html-tags', () => ({
  htmlTags: [{ tag: 'div' }, { tag: 'span' }],
}))

vi.mock('@/data/tags/css-properties', () => ({
  cssProperties: [{ property: 'color' }],
}))

vi.mock('@/data/tags/popular-tags', () => ({
  popularTags: [{ name: 'div' }, { name: 'color' }, { name: 'flex' }],
}))

function renderHero() {
  return render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>
  )
}

describe('HeroSection', () => {
  it('renders "Code" and "Library" title', () => {
    renderHero()
    expect(screen.getByText('Code')).toBeInTheDocument()
    expect(screen.getByText('Library')).toBeInTheDocument()
  })

  it('renders snippet count badge', () => {
    renderHero()
    expect(screen.getByText('42+ Snippets')).toBeInTheDocument()
  })

  it('renders stats section with total snippets', () => {
    renderHero()
    const statElements = screen.getAllByText('42')
    expect(statElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders tags count (2 html + 1 css + 3 popular = 6)', () => {
    renderHero()
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('renders categories count', () => {
    renderHero()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders stat labels', () => {
    renderHero()
    expect(screen.getByText('Snippets')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })

  it('renders "Browse Snippets" CTA button', () => {
    renderHero()
    const link = screen.getByText('Browse Snippets')
    expect(link.closest('a')).toHaveAttribute('href', '/snippets')
  })

  it('renders scroll indicator', () => {
    renderHero()
    expect(screen.getByText('Scroll')).toBeInTheDocument()
  })

  it('renders subtitle text', () => {
    renderHero()
    expect(screen.getByText(/Modern patterns for TypeScript/)).toBeInTheDocument()
  })
})
