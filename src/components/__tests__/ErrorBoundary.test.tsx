import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '../common/ErrorBoundary'

function ProblemChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for expected errors
  const originalError = console.error
  beforeAll(() => {
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('Error: Uncaught')) return
      if (typeof args[0] === 'string' && args[0].includes('The above error')) return
      originalError.call(console, ...args)
    }
  })
  afterAll(() => {
    console.error = originalError
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>child content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('renders custom fallback on error', () => {
    render(
      <ErrorBoundary fallback={<div>custom fallback</div>}>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    )
    expect(screen.getByText('custom fallback')).toBeInTheDocument()
  })

  it('renders default error UI on error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    )
    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('recovers when "Попробовать снова" is clicked', async () => {
    const user = userEvent.setup()

    let shouldThrow = true
    function Wrapper() {
      if (shouldThrow) {
        throw new Error('Test error')
      }
      return <div>recovered</div>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <Wrapper />
      </ErrorBoundary>
    )

    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument()

    shouldThrow = false
    await user.click(screen.getByText('Попробовать снова'))

    rerender(
      <ErrorBoundary>
        <Wrapper />
      </ErrorBoundary>
    )

    expect(screen.getByText('recovered')).toBeInTheDocument()
  })
})
