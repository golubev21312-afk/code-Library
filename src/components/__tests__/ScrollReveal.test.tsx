import { render, screen } from '@testing-library/react'
import { ScrollReveal } from '../animations/ScrollReveal'

// Mock useScrollReveal
let mockIsVisible = false
vi.mock('@/hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({
    ref: { current: null },
    isVisible: mockIsVisible,
  }),
}))

describe('ScrollReveal', () => {
  beforeEach(() => {
    mockIsVisible = false
  })

  it('renders children', () => {
    render(<ScrollReveal><span>Content</span></ScrollReveal>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies scroll-hidden class when not visible', () => {
    const { container } = render(<ScrollReveal><span>Hi</span></ScrollReveal>)
    expect(container.firstChild).toHaveClass('scroll-hidden')
  })

  it('applies scroll-visible class when visible', () => {
    mockIsVisible = true
    const { container } = render(<ScrollReveal><span>Hi</span></ScrollReveal>)
    expect(container.firstChild).toHaveClass('scroll-visible')
  })

  it('applies custom className', () => {
    const { container } = render(
      <ScrollReveal className="custom"><span>Hi</span></ScrollReveal>
    )
    expect(container.firstChild).toHaveClass('custom')
  })

  it('applies transition delay from props', () => {
    const { container } = render(
      <ScrollReveal delay={300}><span>Hi</span></ScrollReveal>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transitionDelay).toBe('300ms')
  })

  it('applies default 0ms delay', () => {
    const { container } = render(<ScrollReveal><span>Hi</span></ScrollReveal>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.transitionDelay).toBe('0ms')
  })

  it('has transition classes', () => {
    const { container } = render(<ScrollReveal><span>Hi</span></ScrollReveal>)
    expect(container.firstChild).toHaveClass('transition-all', 'duration-700', 'ease-out')
  })
})
