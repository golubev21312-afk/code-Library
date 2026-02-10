import { render, screen } from '@testing-library/react'
import { SnippetsByLevel } from '../snippets/SnippetsByLevel'
import type { Snippet } from '@/types'

// Mock SnippetCard since it has complex dependencies
vi.mock('../snippets/SnippetCard', () => ({
  SnippetCard: ({ snippet }: { snippet: Snippet }) => (
    <div data-testid={`snippet-${snippet.id}`}>{snippet.title}</div>
  ),
}))

// Mock AnimatedCard
vi.mock('@/components/animations/AnimatedCard', () => ({
  AnimatedCard: ({ children, delay }: { children: React.ReactNode; delay: number }) => (
    <div data-testid="animated-card" data-delay={delay}>{children}</div>
  ),
}))

const makeSnippet = (id: string, level: Snippet['level']): Snippet => ({
  id,
  title: `Snippet ${id}`,
  description: 'Description',
  code: 'code',
  language: 'ts',
  level,
  tags: ['test'],
})

describe('SnippetsByLevel', () => {
  it('renders all three level sections when snippets exist', () => {
    const snippets = [
      makeSnippet('b1', 'beginner'),
      makeSnippet('i1', 'intermediate'),
      makeSnippet('a1', 'advanced'),
    ]

    render(<SnippetsByLevel snippets={snippets} />)

    expect(screen.getByText('Начальный уровень')).toBeInTheDocument()
    expect(screen.getByText('Средний уровень')).toBeInTheDocument()
    expect(screen.getByText('Продвинутый уровень')).toBeInTheDocument()
  })

  it('hides section for empty level', () => {
    const snippets = [
      makeSnippet('b1', 'beginner'),
      makeSnippet('b2', 'beginner'),
    ]

    render(<SnippetsByLevel snippets={snippets} />)

    expect(screen.getByText('Начальный уровень')).toBeInTheDocument()
    expect(screen.queryByText('Средний уровень')).not.toBeInTheDocument()
    expect(screen.queryByText('Продвинутый уровень')).not.toBeInTheDocument()
  })

  it('renders correct snippet count text (1 сниппет)', () => {
    const snippets = [makeSnippet('b1', 'beginner')]

    render(<SnippetsByLevel snippets={snippets} />)

    expect(screen.getByText('1 сниппет')).toBeInTheDocument()
  })

  it('renders correct snippet count text (3 сниппета)', () => {
    const snippets = [
      makeSnippet('b1', 'beginner'),
      makeSnippet('b2', 'beginner'),
      makeSnippet('b3', 'beginner'),
    ]

    render(<SnippetsByLevel snippets={snippets} />)

    expect(screen.getByText('3 сниппета')).toBeInTheDocument()
  })

  it('renders correct snippet count text (5+ сниппетов)', () => {
    const snippets = Array.from({ length: 6 }, (_, i) =>
      makeSnippet(`b${i}`, 'beginner')
    )

    render(<SnippetsByLevel snippets={snippets} />)

    expect(screen.getByText('6 сниппетов')).toBeInTheDocument()
  })

  it('renders all snippet cards', () => {
    const snippets = [
      makeSnippet('b1', 'beginner'),
      makeSnippet('i1', 'intermediate'),
      makeSnippet('a1', 'advanced'),
    ]

    render(<SnippetsByLevel snippets={snippets} />)

    expect(screen.getByTestId('snippet-b1')).toBeInTheDocument()
    expect(screen.getByTestId('snippet-i1')).toBeInTheDocument()
    expect(screen.getByTestId('snippet-a1')).toBeInTheDocument()
  })

  it('renders nothing when snippets array is empty', () => {
    const { container } = render(<SnippetsByLevel snippets={[]} />)
    // All sections are hidden
    expect(container.querySelectorAll('section')).toHaveLength(0)
  })

  it('applies incremental animation delays', () => {
    const snippets = [
      makeSnippet('b1', 'beginner'),
      makeSnippet('b2', 'beginner'),
      makeSnippet('i1', 'intermediate'),
    ]

    render(<SnippetsByLevel snippets={snippets} />)

    const animatedCards = screen.getAllByTestId('animated-card')
    // beginner: delay 0, 50; intermediate: delay 100 (2*50)
    expect(animatedCards[0]).toHaveAttribute('data-delay', '0')
    expect(animatedCards[1]).toHaveAttribute('data-delay', '50')
    expect(animatedCards[2]).toHaveAttribute('data-delay', '100')
  })
})
