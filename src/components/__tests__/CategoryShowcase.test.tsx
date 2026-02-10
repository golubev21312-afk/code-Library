import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CategoryShowcase } from '../home/CategoryShowcase'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/components/animations/AnimatedCard', () => ({
  AnimatedCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/common/LanguageIcon', () => ({
  LanguageIcon: ({ language }: { language: string }) => (
    <span data-testid={`lang-icon-${language}`} />
  ),
}))

vi.mock('@/components/common/TechIcons', () => ({
  HTMLIcon: ({ className }: { className?: string }) => (
    <svg data-testid="html-icon" className={className} />
  ),
}))

vi.mock('@/data/snippets', () => ({
  getSnippetsByCategory: () => ({
    typescript: [],
    javascript: [],
    react: [],
    css: [],
    html: [],
  }),
  getSnippetsStats: () => ({
    total: 50,
    categories: 5,
    byCategory: { typescript: 15, javascript: 10, react: 12, css: 8, html: 5 },
    byLevel: {},
    byLanguage: {},
  }),
}))

function renderComponent() {
  return render(
    <MemoryRouter>
      <CategoryShowcase />
    </MemoryRouter>
  )
}

describe('CategoryShowcase', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders "Categories" heading', () => {
    renderComponent()
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })

  it('renders category cards', () => {
    renderComponent()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()
    expect(screen.getByText('HTML')).toBeInTheDocument()
  })

  it('renders snippet counts per category', () => {
    renderComponent()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('renders category descriptions', () => {
    renderComponent()
    expect(screen.getByText('Типизация, generics, utility types')).toBeInTheDocument()
    expect(screen.getByText(/ES2025\+/)).toBeInTheDocument()
  })

  it('renders language icons for each category', () => {
    renderComponent()
    expect(screen.getByTestId('lang-icon-ts')).toBeInTheDocument()
    expect(screen.getByTestId('lang-icon-js')).toBeInTheDocument()
    expect(screen.getByTestId('lang-icon-react')).toBeInTheDocument()
    expect(screen.getByTestId('lang-icon-css')).toBeInTheDocument()
    expect(screen.getByTestId('lang-icon-html')).toBeInTheDocument()
  })

  it('renders "All Snippets" button', () => {
    renderComponent()
    const link = screen.getByText('All Snippets').closest('a')
    expect(link).toHaveAttribute('href', '/snippets')
  })

  it('renders "Browse all" text for each category', () => {
    renderComponent()
    const browseLinks = screen.getAllByText('Browse all')
    expect(browseLinks.length).toBe(5)
  })

  it('renders HTML logo button', () => {
    renderComponent()
    expect(screen.getByTitle('HTML snippets')).toBeInTheDocument()
  })

  it('HTML logo navigates on click', () => {
    renderComponent()

    fireEvent.click(screen.getByTitle('HTML snippets'))
    vi.advanceTimersByTime(500)

    expect(mockNavigate).toHaveBeenCalledWith('/snippets?category=html')
  })
})
