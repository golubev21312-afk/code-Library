import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../layout/Header'

// Mock themeStore
let mockTheme = 'dark'
const mockSetTheme = vi.fn()
vi.mock('@/store/themeStore', () => ({
  useThemeStore: (selector?: (state: { theme: string; setTheme: (t: string) => void }) => unknown) => {
    const state = { theme: mockTheme, setTheme: mockSetTheme }
    return selector ? selector(state) : state
  },
}))

// Mock favoritesStore
let mockFavCount = 0
vi.mock('@/store/favoritesStore', () => ({
  useFavorites: () => ({
    count: mockFavCount,
    favoriteIds: [],
    toggleFavorite: vi.fn(),
    isFavorite: () => false,
  }),
}))

function renderHeader(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Header />
    </MemoryRouter>
  )
}

describe('Header', () => {
  beforeEach(() => {
    mockTheme = 'dark'
    mockSetTheme.mockClear()
    mockFavCount = 0
  })

  it('renders the logo link', () => {
    renderHeader()
    expect(screen.getByText('Code Library')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderHeader()
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('Сниппеты')).toBeInTheDocument()
    expect(screen.getByText('Теги')).toBeInTheDocument()
    expect(screen.getByText('Избранное')).toBeInTheDocument()
    expect(screen.getByText('Quiz')).toBeInTheDocument()
  })

  it('highlights active link for home page', () => {
    renderHeader('/')
    // The active link button should have variant=secondary (bg-secondary class)
    const homeButtons = screen.getAllByText('Главная')
    const desktopButton = homeButtons[0].closest('button')
    expect(desktopButton?.className).toContain('bg-secondary')
  })

  it('highlights active link for snippets page', () => {
    renderHeader('/snippets')
    const buttons = screen.getAllByText('Сниппеты')
    const desktopButton = buttons[0].closest('button')
    expect(desktopButton?.className).toContain('bg-secondary')
  })

  it('shows favorites count when > 0', () => {
    mockFavCount = 5
    renderHeader()
    // Desktop nav shows the count in a badge span
    const badges = screen.getAllByText('5')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('does not show favorites count when 0', () => {
    mockFavCount = 0
    renderHeader()
    // The number badge should not be present
    const favBadges = screen.queryAllByText('0')
    // Filter for badges inside the favorites button area
    expect(
      favBadges.filter((el) =>
        el.className?.includes('rounded-full')
      )
    ).toHaveLength(0)
  })

  it('shows 9+ when favorites count > 9 in mobile nav', () => {
    mockFavCount = 15
    renderHeader()
    expect(screen.getByText('9+')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    renderHeader()
    expect(screen.getByTitle('Тёмная тема')).toBeInTheDocument()
  })

  it('cycles theme on toggle click', async () => {
    const user = userEvent.setup()
    renderHeader()

    const themeButton = screen.getByTitle('Тёмная тема')
    await user.click(themeButton)

    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })
})
