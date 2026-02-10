import { render } from '@testing-library/react'
import {
  TypeScriptIcon,
  JavaScriptIcon,
  ReactIcon,
  CSSIcon,
  HTMLIcon,
  HeroTechIcons,
} from '../common/TechIcons'

describe('TypeScriptIcon', () => {
  it('renders SVG', () => {
    const { container } = render(<TypeScriptIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies className', () => {
    const { container } = render(<TypeScriptIcon className="w-8 h-8" />)
    expect(container.querySelector('svg')).toHaveClass('w-8', 'h-8')
  })
})

describe('JavaScriptIcon', () => {
  it('renders SVG', () => {
    const { container } = render(<JavaScriptIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies className', () => {
    const { container } = render(<JavaScriptIcon className="custom" />)
    expect(container.querySelector('svg')).toHaveClass('custom')
  })
})

describe('ReactIcon', () => {
  it('renders SVG with ellipses for orbits', () => {
    const { container } = render(<ReactIcon />)
    const ellipses = container.querySelectorAll('ellipse')
    expect(ellipses.length).toBe(3)
  })
})

describe('CSSIcon', () => {
  it('renders SVG', () => {
    const { container } = render(<CSSIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('contains CSS3 text', () => {
    const { container } = render(<CSSIcon />)
    expect(container.querySelector('text')?.textContent).toBe('CSS3')
  })
})

describe('HTMLIcon', () => {
  it('renders SVG', () => {
    const { container } = render(<HTMLIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('contains HTML5 text', () => {
    const { container } = render(<HTMLIcon />)
    expect(container.querySelector('text')?.textContent).toBe('HTML5')
  })
})

describe('HeroTechIcons', () => {
  it('renders container with aria-hidden', () => {
    const { container } = render(<HeroTechIcons />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders 6 animated icons', () => {
    const { container } = render(<HeroTechIcons />)
    const icons = container.querySelectorAll('.animate-float')
    expect(icons.length).toBe(6)
  })

  it('has pointer-events-none', () => {
    const { container } = render(<HeroTechIcons />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('applies different animation delays', () => {
    const { container } = render(<HeroTechIcons />)
    const icons = container.querySelectorAll('.animate-float')
    const delays = Array.from(icons).map((el) => (el as HTMLElement).style.animationDelay)
    // All delays should be unique
    expect(new Set(delays).size).toBe(delays.length)
  })
})
