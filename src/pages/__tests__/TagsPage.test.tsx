import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagsPage } from '../TagsPage'

// Mock CodeBlock
vi.mock('@/components/code/CodeBlock', () => ({
  CodeBlock: ({ code }: { code: string }) => (
    <pre data-testid="code-block">{code}</pre>
  ),
}))

vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => <pre>{children}</pre>,
}))

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: {},
  oneLight: {},
}))

vi.mock('@/store/themeStore', () => ({
  useThemeStore: (selector: (s: { theme: string }) => unknown) => selector({ theme: 'dark' }),
  getResolvedTheme: () => 'dark',
}))

const mockToastSuccess = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: vi.fn(),
  },
}))

describe('TagsPage', () => {
  beforeEach(() => {
    mockToastSuccess.mockClear()
  })

  it('renders page title', () => {
    render(<TagsPage />)
    expect(screen.getByText('Справочник тегов')).toBeInTheDocument()
  })

  it('renders stats in header', () => {
    render(<TagsPage />)
    expect(screen.getByText(/HTML тегов/)).toBeInTheDocument()
    expect(screen.getByText(/CSS свойств/)).toBeInTheDocument()
  })

  it('renders popular tags section', () => {
    render(<TagsPage />)
    expect(screen.getByText('Популярные теги')).toBeInTheDocument()
  })

  it('renders popular filter badges', () => {
    render(<TagsPage />)
    // Filter badges for popular tags section
    const allBadges = screen.getAllByText('Все')
    expect(allBadges.length).toBeGreaterThan(0)
  })

  it('renders HTML and CSS tabs', () => {
    render(<TagsPage />)
    expect(screen.getByText(/^HTML \(/)).toBeInTheDocument()
    expect(screen.getByText(/^CSS \(/)).toBeInTheDocument()
  })

  it('renders html tags in the HTML tab', () => {
    render(<TagsPage />)
    // The page renders multiple elements containing <div>
    const divElements = screen.getAllByText(/<div>/)
    expect(divElements.length).toBeGreaterThan(0)
  })

  it('filters popular tags by type', async () => {
    const user = userEvent.setup()
    render(<TagsPage />)

    // Click HTML filter in popular tags section
    const htmlBadges = screen.getAllByText('HTML')
    // The first one should be in the popular section filter
    await user.click(htmlBadges[0])

    // Should still show popular tags section
    expect(screen.getByText('Популярные теги')).toBeInTheDocument()
  })

  it('renders "Полный справочник" divider', () => {
    render(<TagsPage />)
    expect(screen.getByText('Полный справочник')).toBeInTheDocument()
  })

  it('renders HTML category filter badges', () => {
    render(<TagsPage />)
    // Check for "Все (N)" badge in HTML tab
    const allBadges = screen.getAllByText(/^Все \(/)
    expect(allBadges.length).toBeGreaterThan(0)
  })

  it('renders "Пример кода" buttons for tags', () => {
    render(<TagsPage />)
    const exampleButtons = screen.getAllByText('Пример кода')
    expect(exampleButtons.length).toBeGreaterThan(0)
  })
})
