import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SnippetPreviewCard } from '../home/SnippetPreviewCard'
import type { Snippet } from '@/types'

// Mock sonner
const mockToastSuccess = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: vi.fn(),
  },
}))

// Mock favoritesStore
let mockIsFavorite = false
const mockToggleFavorite = vi.fn()
vi.mock('@/store/favoritesStore', () => ({
  useFavoritesStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      favoriteIds: mockIsFavorite ? ['preview-snippet'] : [],
      toggleFavorite: mockToggleFavorite,
    }),
  selectIsFavorite: (id: string) => (state: { favoriteIds: string[] }) =>
    state.favoriteIds.includes(id),
}))

const snippet: Snippet = {
  id: 'preview-snippet',
  title: 'useEffect Cleanup',
  description: 'Очистка побочных эффектов в useEffect',
  code: 'useEffect(() => { return () => cleanup() }, [])',
  language: 'tsx',
  level: 'intermediate',
  tags: ['react', 'hooks', 'cleanup', 'effects', 'lifecycle'],
}

function renderCard(props: Partial<{ snippet: Snippet; className: string }> = {}) {
  return render(
    <MemoryRouter>
      <SnippetPreviewCard snippet={props.snippet ?? snippet} className={props.className} />
    </MemoryRouter>
  )
}

describe('SnippetPreviewCard', () => {
  beforeEach(() => {
    mockIsFavorite = false
    mockToggleFavorite.mockClear()
    mockToastSuccess.mockClear()
  })

  it('renders snippet title', () => {
    renderCard()
    expect(screen.getByText('useEffect Cleanup')).toBeInTheDocument()
  })

  it('renders snippet description', () => {
    renderCard()
    expect(screen.getByText('Очистка побочных эффектов в useEffect')).toBeInTheDocument()
  })

  it('renders level badge', () => {
    renderCard()
    expect(screen.getByText('Средний')).toBeInTheDocument()
  })

  it('renders tags (up to 4)', () => {
    renderCard()
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('hooks')).toBeInTheDocument()
    expect(screen.getByText('cleanup')).toBeInTheDocument()
    expect(screen.getByText('effects')).toBeInTheDocument()
  })

  it('shows +N for extra tags', () => {
    renderCard()
    // 5 tags total, 4 shown, +1 extra
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('renders link to snippet detail page', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/snippet/preview-snippet')
  })

  it('renders language icon', () => {
    renderCard()
    expect(screen.getByText('TSX')).toBeInTheDocument()
  })

  it('toggles favorite on heart button click', async () => {
    const user = userEvent.setup()
    renderCard()

    // Find the heart button (it's a ghost button inside the card)
    const buttons = screen.getAllByRole('button')
    const heartButton = buttons.find((b) => b.querySelector('.lucide-heart'))
    expect(heartButton).toBeDefined()

    await user.click(heartButton!)
    expect(mockToggleFavorite).toHaveBeenCalledWith('preview-snippet')
  })

  it('shows toast when adding to favorites', async () => {
    const user = userEvent.setup()
    mockIsFavorite = false
    renderCard()

    const buttons = screen.getAllByRole('button')
    const heartButton = buttons.find((b) => b.querySelector('.lucide-heart'))
    await user.click(heartButton!)

    expect(mockToastSuccess).toHaveBeenCalledWith('Добавлено в избранное')
  })

  it('shows toast when removing from favorites', async () => {
    const user = userEvent.setup()
    mockIsFavorite = true
    renderCard()

    const buttons = screen.getAllByRole('button')
    const heartButton = buttons.find((b) => b.querySelector('.lucide-heart'))
    await user.click(heartButton!)

    expect(mockToastSuccess).toHaveBeenCalledWith('Удалено из избранного')
  })

  it('renders beginner level badge', () => {
    renderCard({ snippet: { ...snippet, level: 'beginner' } })
    expect(screen.getByText('Начальный')).toBeInTheDocument()
  })

  it('renders advanced level badge', () => {
    renderCard({ snippet: { ...snippet, level: 'advanced' } })
    expect(screen.getByText('Продвинутый')).toBeInTheDocument()
  })
})
