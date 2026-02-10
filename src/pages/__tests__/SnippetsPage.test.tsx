import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SnippetsPage } from '../SnippetsPage'
import type { Snippet } from '@/types'

// Create enough snippets for pagination testing
const mockSnippets: Snippet[] = Array.from({ length: 25 }, (_, i) => ({
  id: `snippet-${i}`,
  title: `Snippet ${i}`,
  description: `Description ${i}`,
  code: `code ${i}`,
  language: 'ts' as const,
  level: (['beginner', 'intermediate', 'advanced'] as const)[i % 3],
  tags: ['test'],
}))

const mockSnippetsByCategory = new Map([
  ['typescript', mockSnippets.slice(0, 15)],
  ['react', mockSnippets.slice(15)],
])

vi.mock('@/data/snippets', () => ({
  getSnippetsByCategory: () => mockSnippetsByCategory,
  getCategories: () => ['typescript', 'react'],
  getSnippetsStats: () => ({
    total: 25,
    categories: 2,
    byCategory: { typescript: 15, react: 10 },
    byLevel: { beginner: 9, intermediate: 8, advanced: 8 },
  }),
  searchSnippets: (query: string) => {
    const q = query.toLowerCase()
    return mockSnippets.filter(
      (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    )
  },
}))

// Mock SnippetCard
vi.mock('@/components/snippets/SnippetCard', () => ({
  SnippetCard: ({ snippet }: { snippet: Snippet }) => (
    <div data-testid={`snippet-${snippet.id}`}>{snippet.title}</div>
  ),
}))

vi.mock('@/components/snippets/SnippetsByLevel', () => ({
  SnippetsByLevel: ({ snippets }: { snippets: Snippet[] }) => (
    <div data-testid="by-level">{snippets.length} snippets by level</div>
  ),
}))

vi.mock('@/components/common/LanguageIcon', () => ({
  LanguageIcon: ({ language }: { language: string }) => (
    <span data-testid={`lang-icon-${language}`} />
  ),
}))

vi.mock('@/components/animations/AnimatedCard', () => ({
  AnimatedCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/store/favoritesStore', () => ({
  useFavorites: () => ({ count: 3, favoriteIds: [] }),
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <SnippetsPage />
    </MemoryRouter>
  )
}

describe('SnippetsPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders page title', () => {
    renderPage()
    expect(screen.getByText('Все сниппеты')).toBeInTheDocument()
  })

  it('renders stats', () => {
    renderPage()
    expect(screen.getByText(/25 сниппетов в 2 категориях/)).toBeInTheDocument()
  })

  it('shows favorites count in stats', () => {
    renderPage()
    expect(screen.getByText(/3 в избранном/)).toBeInTheDocument()
  })

  it('renders category filter buttons', () => {
    renderPage()
    expect(screen.getByText('Все категории')).toBeInTheDocument()
  })

  it('renders level filter buttons in grid mode', () => {
    renderPage()
    expect(screen.getByText('Все уровни')).toBeInTheDocument()
    expect(screen.getByText('Начальный')).toBeInTheDocument()
    expect(screen.getByText('Средний')).toBeInTheDocument()
    expect(screen.getByText('Продвинутый')).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Поиск сниппетов...')).toBeInTheDocument()
  })

  it('renders sort select', () => {
    renderPage()
    expect(screen.getByDisplayValue('По умолчанию')).toBeInTheDocument()
  })

  it('renders view mode toggle buttons', () => {
    renderPage()
    expect(screen.getByText('Сетка')).toBeInTheDocument()
    expect(screen.getByText('По уровню')).toBeInTheDocument()
  })

  it('shows pagination for 25 items', () => {
    renderPage()
    // 25 items / 20 per page = 2 pages
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('paginates - shows first 20 snippets', () => {
    renderPage()
    expect(screen.getByTestId('snippet-snippet-0')).toBeInTheDocument()
    expect(screen.getByTestId('snippet-snippet-19')).toBeInTheDocument()
    expect(screen.queryByTestId('snippet-snippet-20')).not.toBeInTheDocument()
  })

  it('switches to "by level" view', async () => {
    vi.useRealTimers() // need real timers for user events
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByText('По уровню'))
    expect(screen.getByTestId('by-level')).toBeInTheDocument()
  })

  it('hides level filter in "by level" mode', async () => {
    vi.useRealTimers()
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByText('По уровню'))
    expect(screen.queryByText('Все уровни')).not.toBeInTheDocument()
  })
})
