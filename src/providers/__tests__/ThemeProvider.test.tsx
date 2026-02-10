import { render } from '@testing-library/react'
import { ThemeProvider } from '../ThemeProvider'
import { useThemeStore } from '@/store/themeStore'

describe('ThemeProvider', () => {
  let addEventListenerSpy: ReturnType<typeof vi.fn>
  let removeEventListenerSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Reset to default
    useThemeStore.setState({ theme: 'dark' })
    // Clean up classes
    document.documentElement.classList.remove('light', 'dark')

    addEventListenerSpy = vi.fn()
    removeEventListenerSpy = vi.fn()

    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: addEventListenerSpy,
        removeEventListener: removeEventListenerSpy,
      }))
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Hello</div>
      </ThemeProvider>
    )
    expect(getByText('Hello')).toBeInTheDocument()
  })

  it('applies dark class when theme is dark', () => {
    useThemeStore.setState({ theme: 'dark' })
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>
    )
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
  })

  it('applies light class when theme is light', () => {
    useThemeStore.setState({ theme: 'light' })
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>
    )
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('applies system theme class when theme is system', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true, // prefers dark
        addEventListener: addEventListenerSpy,
        removeEventListener: removeEventListenerSpy,
      }))
    )

    useThemeStore.setState({ theme: 'system' })
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>
    )
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('registers media query listener when theme is system', () => {
    useThemeStore.setState({ theme: 'system' })
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>
    )
    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('does not register media query listener for non-system themes', () => {
    useThemeStore.setState({ theme: 'dark' })
    render(
      <ThemeProvider>
        <div />
      </ThemeProvider>
    )
    expect(addEventListenerSpy).not.toHaveBeenCalled()
  })

  it('removes media query listener on unmount', () => {
    useThemeStore.setState({ theme: 'system' })
    const { unmount } = render(
      <ThemeProvider>
        <div />
      </ThemeProvider>
    )
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('removes old classes when theme changes', () => {
    useThemeStore.setState({ theme: 'dark' })
    const { rerender } = render(
      <ThemeProvider>
        <div />
      </ThemeProvider>
    )

    expect(document.documentElement.classList.contains('dark')).toBe(true)

    useThemeStore.setState({ theme: 'light' })
    rerender(
      <ThemeProvider>
        <div />
      </ThemeProvider>
    )

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
