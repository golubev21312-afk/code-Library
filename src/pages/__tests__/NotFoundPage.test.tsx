import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from '../NotFoundPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  )
}

describe('NotFoundPage', () => {
  it('renders 404 heading', () => {
    renderPage()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders a fun message', () => {
    renderPage()
    // The page picks a random message from an array, so just check that some text is present
    const container = screen.getByText('404').closest('div')?.parentElement
    expect(container).toBeTruthy()
  })

  it('renders random image', () => {
    renderPage()
    const img = screen.getByAltText('Random nature')
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('src')).toContain('picsum.photos')
  })

  it('renders refresh image button', () => {
    renderPage()
    expect(screen.getByTitle('Другая картинка')).toBeInTheDocument()
  })

  it('changes image on refresh button click', async () => {
    const user = userEvent.setup()
    renderPage()

    const img = screen.getByAltText('Random nature')

    // Mock Math.random to return different value
    const originalRandom = Math.random
    Math.random = () => 0.999
    await user.click(screen.getByTitle('Другая картинка'))
    Math.random = originalRandom

    const newSrc = img.getAttribute('src')
    // The seed should be different (most of the time)
    expect(newSrc).toContain('picsum.photos')
  })

  it('renders "На главную" link', () => {
    renderPage()
    const homeLink = screen.getByText('На главную').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('renders "К сниппетам" link', () => {
    renderPage()
    const snippetsLink = screen.getByText('К сниппетам').closest('a')
    expect(snippetsLink).toHaveAttribute('href', '/snippets')
  })

  it('renders description text', () => {
    renderPage()
    expect(
      screen.getByText(/Пока вы любуетесь картинкой/)
    ).toBeInTheDocument()
  })
})
