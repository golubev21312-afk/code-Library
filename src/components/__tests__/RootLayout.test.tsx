import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RootLayout } from '../layout/RootLayout'

// Mock Header to simplify
vi.mock('../layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}))

// Mock stores used by Header
vi.mock('@/store/themeStore', () => ({
  useThemeStore: (selector?: (s: { theme: string; setTheme: () => void }) => unknown) => {
    const state = { theme: 'dark', setTheme: vi.fn() }
    return selector ? selector(state) : state
  },
}))

vi.mock('@/store/favoritesStore', () => ({
  useFavorites: () => ({ count: 0, favoriteIds: [] }),
}))

function renderLayout(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/snippets" element={<div>Snippets Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('RootLayout', () => {
  it('renders Header', () => {
    renderLayout()
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders page content via Outlet', () => {
    renderLayout('/')
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('renders skip-to-content accessibility link', () => {
    renderLayout()
    expect(screen.getByText('Перейти к содержимому')).toBeInTheDocument()
  })

  it('skip-to-content link points to #main-content', () => {
    renderLayout()
    const link = screen.getByText('Перейти к содержимому')
    expect(link).toHaveAttribute('href', '#main-content')
  })

  it('does NOT apply pt-16 on home page', () => {
    renderLayout('/')
    const main = screen.getByRole('main')
    expect(main.className).not.toContain('pt-16')
  })

  it('applies pt-16 on non-home pages', () => {
    renderLayout('/snippets')
    const main = screen.getByRole('main')
    expect(main.className).toContain('pt-16')
  })

  it('main element has id "main-content"', () => {
    renderLayout()
    const main = screen.getByRole('main')
    expect(main.id).toBe('main-content')
  })
})
