import { render, screen } from '@testing-library/react'
import { LanguageIcon, LanguageIconLarge } from '../common/LanguageIcon'

describe('LanguageIcon', () => {
  it('renders TS label for "ts" language', () => {
    render(<LanguageIcon language="ts" />)
    expect(screen.getByText('TS')).toBeInTheDocument()
  })

  it('renders TSX label for "tsx" language', () => {
    render(<LanguageIcon language="tsx" />)
    expect(screen.getByText('TSX')).toBeInTheDocument()
  })

  it('renders JS label for "js" language', () => {
    render(<LanguageIcon language="js" />)
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('renders JSX label for "jsx" language', () => {
    render(<LanguageIcon language="jsx" />)
    expect(screen.getByText('JSX')).toBeInTheDocument()
  })

  it('renders CSS label for "css" language', () => {
    render(<LanguageIcon language="css" />)
    expect(screen.getByText('CSS')).toBeInTheDocument()
  })

  it('renders HTML label for "html" language', () => {
    render(<LanguageIcon language="html" />)
    expect(screen.getByText('HTML')).toBeInTheDocument()
  })

  it('renders JSON label for "json" language', () => {
    render(<LanguageIcon language="json" />)
    expect(screen.getByText('JSON')).toBeInTheDocument()
  })

  it('renders $ label for "bash" language', () => {
    render(<LanguageIcon language="bash" />)
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('renders fallback "?" for unknown language', () => {
    render(<LanguageIcon language="unknown-lang" />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('is case-insensitive', () => {
    render(<LanguageIcon language="TypeScript" />)
    expect(screen.getByText('TS')).toBeInTheDocument()
  })

  it('shows language title in uppercase', () => {
    render(<LanguageIcon language="css" />)
    expect(screen.getByTitle('CSS')).toBeInTheDocument()
  })

  it('applies size "sm" classes', () => {
    const { container } = render(<LanguageIcon language="ts" size="sm" />)
    expect(container.firstChild).toHaveClass('w-4', 'h-4')
  })

  it('applies size "lg" classes', () => {
    const { container } = render(<LanguageIcon language="ts" size="lg" />)
    expect(container.firstChild).toHaveClass('w-8', 'h-8')
  })

  it('applies default "md" size', () => {
    const { container } = render(<LanguageIcon language="ts" />)
    expect(container.firstChild).toHaveClass('w-6', 'h-6')
  })

  it('accepts custom className', () => {
    const { container } = render(<LanguageIcon language="ts" className="my-custom" />)
    expect(container.firstChild).toHaveClass('my-custom')
  })
})

describe('LanguageIconLarge', () => {
  it('renders correct label', () => {
    render(<LanguageIconLarge language="js" />)
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('renders fallback for unknown language', () => {
    render(<LanguageIconLarge language="xyz" />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('has large size classes', () => {
    const { container } = render(<LanguageIconLarge language="ts" />)
    expect(container.firstChild).toHaveClass('w-16', 'h-16')
  })

  it('accepts custom className', () => {
    const { container } = render(<LanguageIconLarge language="ts" className="extra" />)
    expect(container.firstChild).toHaveClass('extra')
  })
})
