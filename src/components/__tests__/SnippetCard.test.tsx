import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SnippetCard } from '../snippets/SnippetCard'
import type { Snippet } from '@/types'

// Mock react-syntax-highlighter (used by CodeBlock)
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => (
    <pre data-testid="syntax-highlighter">
      <code>{children}</code>
    </pre>
  ),
}))

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: {},
  oneLight: {},
}))

// Mock sonner
const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}))

// Mock themeStore
vi.mock('@/store/themeStore', () => ({
  useThemeStore: (selector: (state: { theme: string }) => unknown) =>
    selector({ theme: 'dark' }),
  getResolvedTheme: () => 'dark',
}))

// Mock favoritesStore
let mockIsFavorite = false
const mockToggleFavorite = vi.fn()
vi.mock('@/store/favoritesStore', () => ({
  useFavoritesStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      favoriteIds: mockIsFavorite ? ['test-snippet'] : [],
      toggleFavorite: mockToggleFavorite,
    }),
  selectIsFavorite: (id: string) => (state: { favoriteIds: string[] }) =>
    state.favoriteIds.includes(id),
}))

function mockClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
    configurable: true,
  })
}

const baseSnippet: Snippet = {
  id: 'test-snippet',
  title: 'useState Hook',
  description: 'Хук для управления состоянием компонента',
  code: 'const [count, setCount] = useState(0)',
  language: 'tsx',
  level: 'beginner',
  tags: ['react', 'hooks', 'state'],
}

describe('SnippetCard', () => {
  beforeEach(() => {
    mockIsFavorite = false
    mockToggleFavorite.mockClear()
    mockToastSuccess.mockClear()
    mockToastError.mockClear()
  })

  it('renders snippet title', () => {
    render(<SnippetCard snippet={baseSnippet} />)
    expect(screen.getByText('useState Hook')).toBeInTheDocument()
  })

  it('renders level badge', () => {
    render(<SnippetCard snippet={baseSnippet} />)
    expect(screen.getByText('Начальный')).toBeInTheDocument()
  })

  it('renders intermediate level badge', () => {
    render(
      <SnippetCard
        snippet={{ ...baseSnippet, level: 'intermediate' }}
      />
    )
    expect(screen.getByText('Средний')).toBeInTheDocument()
  })

  it('renders advanced level badge', () => {
    render(
      <SnippetCard snippet={{ ...baseSnippet, level: 'advanced' }} />
    )
    expect(screen.getByText('Продвинутый')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<SnippetCard snippet={baseSnippet} />)
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('hooks')).toBeInTheDocument()
    expect(screen.getByText('state')).toBeInTheDocument()
  })

  it('shows +N badge when more than 5 tags', () => {
    const manyTags = {
      ...baseSnippet,
      tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    }
    render(<SnippetCard snippet={manyTags} />)
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('renders description in default tab', () => {
    render(<SnippetCard snippet={baseSnippet} />)
    expect(
      screen.getByText('Хук для управления состоянием компонента')
    ).toBeInTheDocument()
  })

  it('switches to code tab', async () => {
    const user = userEvent.setup()
    render(<SnippetCard snippet={baseSnippet} />)

    // Find the Code tab trigger
    const codeTabs = screen.getAllByText('Код')
    await user.click(codeTabs[0])

    expect(
      screen.getByText('const [count, setCount] = useState(0)')
    ).toBeInTheDocument()
  })

  it('shows why2026 tab when whyRelevant2026 is set', () => {
    render(
      <SnippetCard
        snippet={{ ...baseSnippet, whyRelevant2026: 'Hooks are standard' }}
      />
    )
    expect(screen.getByText('2026')).toBeInTheDocument()
  })

  it('does not show why2026 tab when whyRelevant2026 is not set', () => {
    render(<SnippetCard snippet={baseSnippet} />)
    expect(screen.queryByText('2026')).not.toBeInTheDocument()
  })

  it('copies code to clipboard', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    mockClipboard(writeText)

    render(<SnippetCard snippet={baseSnippet} />)
    await user.click(screen.getByLabelText('Копировать код'))

    expect(writeText).toHaveBeenCalledWith(
      'const [count, setCount] = useState(0)'
    )
    expect(mockToastSuccess).toHaveBeenCalledWith(
      'Код скопирован в буфер обмена'
    )
  })

  it('shows error toast when clipboard fails', async () => {
    const user = userEvent.setup()
    mockClipboard(vi.fn().mockRejectedValue(new Error('fail')))

    render(<SnippetCard snippet={baseSnippet} />)
    await user.click(screen.getByLabelText('Копировать код'))

    expect(mockToastError).toHaveBeenCalledWith(
      'Не удалось скопировать код'
    )
  })

  it('toggles favorite on heart button click', async () => {
    const user = userEvent.setup()
    render(<SnippetCard snippet={baseSnippet} />)

    await user.click(screen.getByLabelText('Добавить в избранное'))
    expect(mockToggleFavorite).toHaveBeenCalledWith('test-snippet')
  })

  it('shows "Удалить из избранного" label when already favorite', () => {
    mockIsFavorite = true
    render(<SnippetCard snippet={baseSnippet} />)
    expect(
      screen.getByLabelText('Удалить из избранного')
    ).toBeInTheDocument()
  })

  it('renders share button', () => {
    render(<SnippetCard snippet={baseSnippet} />)
    expect(
      screen.getByLabelText('Поделиться сниппетом')
    ).toBeInTheDocument()
  })

  it('renders related snippets when present', () => {
    render(
      <SnippetCard
        snippet={{ ...baseSnippet, related: ['use-effect', 'use-memo'] }}
      />
    )
    expect(screen.getByText('use-effect')).toBeInTheDocument()
    expect(screen.getByText('use-memo')).toBeInTheDocument()
  })
})
