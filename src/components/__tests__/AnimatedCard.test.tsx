import { render, screen } from '@testing-library/react'
import { AnimatedCard } from '../animations/AnimatedCard'

describe('AnimatedCard', () => {
  it('renders children', () => {
    render(<AnimatedCard><span>Hello</span></AnimatedCard>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('applies default 0ms animation delay', () => {
    const { container } = render(<AnimatedCard><span>Hi</span></AnimatedCard>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.animationDelay).toBe('0ms')
  })

  it('applies custom animation delay', () => {
    const { container } = render(
      <AnimatedCard delay={200}><span>Hi</span></AnimatedCard>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.animationDelay).toBe('200ms')
  })

  it('sets animationFillMode to forwards', () => {
    const { container } = render(<AnimatedCard><span>Hi</span></AnimatedCard>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.animationFillMode).toBe('forwards')
  })

  it('has fadeInUp animation class', () => {
    const { container } = render(<AnimatedCard><span>Hi</span></AnimatedCard>)
    expect(container.firstChild).toHaveClass('animate-fadeInUp')
  })

  it('starts with opacity-0', () => {
    const { container } = render(<AnimatedCard><span>Hi</span></AnimatedCard>)
    expect(container.firstChild).toHaveClass('opacity-0')
  })

  it('accepts custom className', () => {
    const { container } = render(
      <AnimatedCard className="custom-class"><span>Hi</span></AnimatedCard>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
