import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FeaturedCarousel } from '../home/FeaturedCarousel'
import type { Snippet } from '@/types'

vi.mock('@/components/home/SnippetPreviewCard', () => ({
  SnippetPreviewCard: ({ snippet }: { snippet: Snippet }) => (
    <div data-testid={`preview-${snippet.id}`}>{snippet.title}</div>
  ),
}))

const mockSnippets: Snippet[] = [
  { id: 'a', title: 'Snippet A', description: '', code: '', language: 'ts', level: 'beginner', tags: [] },
  { id: 'b', title: 'Snippet B', description: '', code: '', language: 'js', level: 'intermediate', tags: [] },
]

function renderCarousel(snippets: Snippet[] = mockSnippets) {
  return render(
    <MemoryRouter>
      <FeaturedCarousel snippets={snippets} />
    </MemoryRouter>
  )
}

describe('FeaturedCarousel', () => {
  it('renders carousel container', () => {
    const { container } = renderCarousel()
    expect(container.querySelector('.carousel-container')).toBeInTheDocument()
  })

  it('renders carousel track', () => {
    const { container } = renderCarousel()
    expect(container.querySelector('.carousel-track')).toBeInTheDocument()
  })

  it('duplicates snippets for infinite scroll', () => {
    renderCarousel()
    // 2 snippets * 2 (duplicated) = 4 preview cards
    const cardsA = screen.getAllByText('Snippet A')
    const cardsB = screen.getAllByText('Snippet B')
    expect(cardsA.length).toBe(2)
    expect(cardsB.length).toBe(2)
  })

  it('renders correct number of carousel items', () => {
    const { container } = renderCarousel()
    const items = container.querySelectorAll('.carousel-item')
    expect(items.length).toBe(4) // 2 * 2
  })

  it('renders with empty snippets array', () => {
    const { container } = renderCarousel([])
    const items = container.querySelectorAll('.carousel-item')
    expect(items.length).toBe(0)
  })

  it('renders with single snippet', () => {
    renderCarousel([mockSnippets[0]])
    const cards = screen.getAllByText('Snippet A')
    expect(cards.length).toBe(2) // duplicated
  })
})
