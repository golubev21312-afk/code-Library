import { render } from '@testing-library/react'
import {
  SnippetCardSkeleton,
  SnippetGridSkeleton,
  SnippetPreviewSkeleton,
  PreviewGridSkeleton,
} from '../snippets/SnippetCardSkeleton'

describe('SnippetCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<SnippetCardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders skeleton elements (bg-muted divs)', () => {
    const { container } = render(<SnippetCardSkeleton />)
    const skeletons = container.querySelectorAll('.bg-muted')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('SnippetGridSkeleton', () => {
  it('renders default 6 skeleton cards', () => {
    const { container } = render(<SnippetGridSkeleton />)
    // Each SnippetCardSkeleton has .overflow-hidden from Card usage
    const cards = container.querySelectorAll('.overflow-hidden')
    expect(cards.length).toBe(6)
  })

  it('renders custom count of cards', () => {
    const { container } = render(<SnippetGridSkeleton count={3} />)
    const cards = container.querySelectorAll('.overflow-hidden')
    expect(cards.length).toBe(3)
  })

  it('renders grid layout', () => {
    const { container } = render(<SnippetGridSkeleton />)
    expect(container.firstChild).toHaveClass('grid')
  })
})

describe('SnippetPreviewSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<SnippetPreviewSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders skeleton elements', () => {
    const { container } = render(<SnippetPreviewSkeleton />)
    const skeletons = container.querySelectorAll('.bg-muted')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('PreviewGridSkeleton', () => {
  it('renders default 6 preview skeletons', () => {
    const { container } = render(<PreviewGridSkeleton />)
    // Each SnippetPreviewSkeleton has .h-full from Card usage
    const cards = container.querySelectorAll('.h-full')
    expect(cards.length).toBe(6)
  })

  it('renders custom count', () => {
    const { container } = render(<PreviewGridSkeleton count={4} />)
    const cards = container.querySelectorAll('.h-full')
    expect(cards.length).toBe(4)
  })

  it('renders grid layout', () => {
    const { container } = render(<PreviewGridSkeleton />)
    expect(container.firstChild).toHaveClass('grid')
  })
})
