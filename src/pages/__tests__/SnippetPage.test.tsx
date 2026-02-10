import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SnippetPage } from '../SnippetPage'
import type { Snippet } from '@/types'

const mockSnippet: Snippet = {
  id: 'test-snippet',
  title: 'Test Snippet',
  description: 'Тестовый сниппет',
  code: 'const x = 1',
  language: 'ts',
  level: 'beginner',
  tags: ['test'],
  related: ['related-1'],
}

const mockRelated: Snippet = {
  id: 'related-1',
  title: 'Related Snippet',
  description: 'Связанный сниппет',
  code: 'const y = 2',
  language: 'ts',
  level: 'intermediate',
  tags: ['test'],
}

vi.mock('@/data/snippets', () => ({
  getSnippetById: (id: string) => {
    if (id === 'test-snippet') return mockSnippet
    if (id === 'related-1') return mockRelated
    return undefined
  },
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

function renderPage(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/snippet/${id}`]}>
      <Routes>
        <Route path="/snippet/:id" element={<SnippetPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('SnippetPage', () => {
  describe('snippet found', () => {
    it('renders snippet card', () => {
      renderPage('test-snippet')
      expect(screen.getByTestId('snippet-test-snippet')).toBeInTheDocument()
    })

    it('renders breadcrumbs with snippet title', () => {
      renderPage('test-snippet')
      // Breadcrumb nav contains "Сниппеты" link and snippet title
      expect(screen.getByText('Сниппеты')).toBeInTheDocument()
      // Title appears in both card and breadcrumb
      const titles = screen.getAllByText('Test Snippet')
      expect(titles.length).toBeGreaterThanOrEqual(2)
    })

    it('renders related snippets section', () => {
      renderPage('test-snippet')
      expect(screen.getByText('Связанные сниппеты')).toBeInTheDocument()
      expect(screen.getByTestId('snippet-related-1')).toBeInTheDocument()
    })

    it('renders back button', () => {
      renderPage('test-snippet')
      expect(screen.getByText('Все сниппеты')).toBeInTheDocument()
    })

    it('back button links to /snippets', () => {
      renderPage('test-snippet')
      const link = screen.getByText('Все сниппеты').closest('a')
      expect(link).toHaveAttribute('href', '/snippets')
    })
  })

  describe('snippet not found', () => {
    it('shows 404 text', () => {
      renderPage('non-existent')
      expect(screen.getByText('404')).toBeInTheDocument()
    })

    it('shows "Сниппет не найден" message', () => {
      renderPage('non-existent')
      expect(screen.getByText('Сниппет не найден')).toBeInTheDocument()
    })

    it('shows the missing ID', () => {
      renderPage('non-existent')
      expect(
        screen.getByText(/non-existent/)
      ).toBeInTheDocument()
    })

    it('shows link back to snippets', () => {
      renderPage('non-existent')
      expect(screen.getByText('К сниппетам')).toBeInTheDocument()
    })
  })
})
