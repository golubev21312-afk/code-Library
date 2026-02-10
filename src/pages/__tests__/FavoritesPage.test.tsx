import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { FavoritesPage } from '../FavoritesPage'
import type { Snippet } from '@/types'

const mockSnippets: Snippet[] = [
  {
    id: 'fav-1',
    title: 'useState Hook',
    description: 'Хук для состояния',
    code: 'const [x, setX] = useState(0)',
    language: 'tsx',
    level: 'beginner',
    tags: ['react'],
  },
  {
    id: 'fav-2',
    title: 'useEffect Hook',
    description: 'Хук для эффектов',
    code: 'useEffect(() => {}, [])',
    language: 'tsx',
    level: 'intermediate',
    tags: ['react'],
  },
]

vi.mock('@/data/snippets', () => ({
  getAllSnippets: () => mockSnippets,
}))

// Mock SnippetCard
vi.mock('@/components/snippets/SnippetCard', () => ({
  SnippetCard: ({ snippet }: { snippet: Snippet }) => (
    <div data-testid={`snippet-${snippet.id}`}>{snippet.title}</div>
  ),
}))

vi.mock('@/components/animations/AnimatedCard', () => ({
  AnimatedCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock favorites store
let mockFavoriteIds: string[] = []
const mockClearFavorites = vi.fn()
vi.mock('@/store/favoritesStore', () => ({
  useFavorites: () => ({
    favoriteIds: mockFavoriteIds,
    count: mockFavoriteIds.length,
    clearFavorites: mockClearFavorites,
    toggleFavorite: vi.fn(),
    isFavorite: (id: string) => mockFavoriteIds.includes(id),
  }),
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <FavoritesPage />
    </MemoryRouter>
  )
}

describe('FavoritesPage', () => {
  beforeEach(() => {
    mockFavoriteIds = []
    mockClearFavorites.mockClear()
  })

  describe('empty state', () => {
    it('shows empty state when no favorites', () => {
      renderPage()
      expect(screen.getByText('Избранное пусто')).toBeInTheDocument()
    })

    it('shows link to snippets page', () => {
      renderPage()
      expect(screen.getByText('Смотреть сниппеты')).toBeInTheDocument()
    })

    it('shows helpful description', () => {
      renderPage()
      expect(
        screen.getByText(/Добавляйте сниппеты в избранное/)
      ).toBeInTheDocument()
    })
  })

  describe('with favorites', () => {
    beforeEach(() => {
      mockFavoriteIds = ['fav-1', 'fav-2']
    })

    it('renders favorite snippets', () => {
      renderPage()
      expect(screen.getByTestId('snippet-fav-1')).toBeInTheDocument()
      expect(screen.getByTestId('snippet-fav-2')).toBeInTheDocument()
    })

    it('shows favorites count', () => {
      renderPage()
      expect(screen.getByText(/2 сниппета в избранном/)).toBeInTheDocument()
    })

    it('shows "Очистить все" button', () => {
      renderPage()
      expect(screen.getByText('Очистить все')).toBeInTheDocument()
    })

    it('calls clearFavorites on confirm', async () => {
      const user = userEvent.setup()
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      renderPage()
      await user.click(screen.getByText('Очистить все'))

      expect(mockClearFavorites).toHaveBeenCalled()
      vi.restoreAllMocks()
    })

    it('does not clear when confirm cancelled', async () => {
      const user = userEvent.setup()
      vi.spyOn(window, 'confirm').mockReturnValue(false)

      renderPage()
      await user.click(screen.getByText('Очистить все'))

      expect(mockClearFavorites).not.toHaveBeenCalled()
      vi.restoreAllMocks()
    })

    it('shows search input', () => {
      renderPage()
      expect(screen.getByPlaceholderText('Поиск в избранном...')).toBeInTheDocument()
    })

    it('shows level filter buttons', () => {
      renderPage()
      expect(screen.getByText('Все уровни')).toBeInTheDocument()
      expect(screen.getByText('Начальный')).toBeInTheDocument()
      expect(screen.getByText('Средний')).toBeInTheDocument()
      expect(screen.getByText('Продвинутый')).toBeInTheDocument()
    })

    it('shows header with heart icon', () => {
      renderPage()
      expect(screen.getByText('Избранное')).toBeInTheDocument()
    })
  })

  describe('with one favorite', () => {
    it('shows correct singular form', () => {
      mockFavoriteIds = ['fav-1']
      renderPage()
      expect(screen.getByText(/1 сниппет в избранном/)).toBeInTheDocument()
    })
  })
})
