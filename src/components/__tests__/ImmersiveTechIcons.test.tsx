import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ImmersiveTechIcons } from '../animations/ImmersiveTechIcons'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@/components/common/TechIcons', () => ({
  TypeScriptIcon: ({ className }: { className?: string }) => (
    <svg data-testid="ts-icon" className={className} />
  ),
  ReactIcon: ({ className }: { className?: string }) => (
    <svg data-testid="react-icon" className={className} />
  ),
  JavaScriptIcon: ({ className }: { className?: string }) => (
    <svg data-testid="js-icon" className={className} />
  ),
  CSSIcon: ({ className }: { className?: string }) => (
    <svg data-testid="css-icon" className={className} />
  ),
}))

function renderComponent() {
  return render(
    <MemoryRouter>
      <ImmersiveTechIcons />
    </MemoryRouter>
  )
}

describe('ImmersiveTechIcons', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders 4 breakable logo buttons', () => {
    renderComponent()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(4)
  })

  it('renders accessibility labels', () => {
    renderComponent()
    expect(screen.getByLabelText('TypeScript snippets')).toBeInTheDocument()
    expect(screen.getByLabelText('React snippets')).toBeInTheDocument()
    expect(screen.getByLabelText('JavaScript snippets')).toBeInTheDocument()
    expect(screen.getByLabelText('CSS snippets')).toBeInTheDocument()
  })

  it('renders title attributes', () => {
    renderComponent()
    expect(screen.getByTitle('TypeScript snippets')).toBeInTheDocument()
    expect(screen.getByTitle('React snippets')).toBeInTheDocument()
    expect(screen.getByTitle('JavaScript snippets')).toBeInTheDocument()
    expect(screen.getByTitle('CSS snippets')).toBeInTheDocument()
  })

  it('navigates to typescript on TS icon click', () => {
    renderComponent()
    fireEvent.click(screen.getByTitle('TypeScript snippets'))
    vi.advanceTimersByTime(500)
    expect(mockNavigate).toHaveBeenCalledWith('/snippets?category=typescript')
  })

  it('navigates to react on React icon click', () => {
    renderComponent()
    fireEvent.click(screen.getByTitle('React snippets'))
    vi.advanceTimersByTime(500)
    expect(mockNavigate).toHaveBeenCalledWith('/snippets?category=react')
  })

  it('navigates to javascript on JS icon click', () => {
    renderComponent()
    fireEvent.click(screen.getByTitle('JavaScript snippets'))
    vi.advanceTimersByTime(500)
    expect(mockNavigate).toHaveBeenCalledWith('/snippets?category=javascript')
  })

  it('navigates to css on CSS icon click', () => {
    renderComponent()
    fireEvent.click(screen.getByTitle('CSS snippets'))
    vi.advanceTimersByTime(500)
    expect(mockNavigate).toHaveBeenCalledWith('/snippets?category=css')
  })

  it('adds breaking class on click', () => {
    renderComponent()
    const button = screen.getByTitle('TypeScript snippets')
    fireEvent.click(button)
    const breakContainer = button.querySelector('.logo-break-container')
    expect(breakContainer).toHaveClass('breaking')
  })

  it('shows split halves when breaking', () => {
    renderComponent()
    fireEvent.click(screen.getByTitle('TypeScript snippets'))
    const button = screen.getByTitle('TypeScript snippets')
    const halves = button.querySelectorAll('.logo-half')
    expect(halves.length).toBe(2)
  })

  it('container has pointer-events-none', () => {
    const { container } = renderComponent()
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })
})
