import { render } from '@testing-library/react'
import { FloatingIcons } from '../animations/FloatingIcons'

vi.mock('@/components/common/LanguageIcon', () => ({
  LanguageIconLarge: ({ language }: { language: string }) => (
    <span data-testid={`float-icon-${language}`} />
  ),
}))

describe('FloatingIcons', () => {
  it('renders container with aria-hidden', () => {
    const { container } = render(<FloatingIcons />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders 7 floating icons', () => {
    const { container } = render(<FloatingIcons />)
    const icons = container.querySelectorAll('.animate-float')
    expect(icons.length).toBe(7)
  })

  it('renders all language types', () => {
    const { getByTestId } = render(<FloatingIcons />)
    expect(getByTestId('float-icon-ts')).toBeInTheDocument()
    expect(getByTestId('float-icon-js')).toBeInTheDocument()
    expect(getByTestId('float-icon-react')).toBeInTheDocument()
    expect(getByTestId('float-icon-css')).toBeInTheDocument()
    expect(getByTestId('float-icon-html')).toBeInTheDocument()
    expect(getByTestId('float-icon-tsx')).toBeInTheDocument()
    expect(getByTestId('float-icon-json')).toBeInTheDocument()
  })

  it('has pointer-events-none on container', () => {
    const { container } = render(<FloatingIcons />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })

  it('applies animation delays to icons', () => {
    const { container } = render(<FloatingIcons />)
    const icons = container.querySelectorAll('.animate-float')
    const firstDelay = (icons[0] as HTMLElement).style.animationDelay
    expect(firstDelay).toBe('0s')
  })
})
