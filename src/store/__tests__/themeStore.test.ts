import { useThemeStore, getSystemTheme, getResolvedTheme } from '../themeStore'

describe('themeStore', () => {
  beforeEach(() => {
    // Reset store to default
    useThemeStore.setState({ theme: 'dark' })
  })

  it('has "dark" as default theme', () => {
    expect(useThemeStore.getState().theme).toBe('dark')
  })

  it('sets theme to light', () => {
    useThemeStore.getState().setTheme('light')
    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('sets theme to system', () => {
    useThemeStore.getState().setTheme('system')
    expect(useThemeStore.getState().theme).toBe('system')
  })

  it('sets theme back to dark', () => {
    useThemeStore.getState().setTheme('light')
    useThemeStore.getState().setTheme('dark')
    expect(useThemeStore.getState().theme).toBe('dark')
  })
})

describe('getSystemTheme', () => {
  it('returns "dark" when prefers-color-scheme is dark', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }))
    )
    expect(getSystemTheme()).toBe('dark')
    vi.unstubAllGlobals()
  })

  it('returns "light" when prefers-color-scheme is not dark', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false }))
    )
    expect(getSystemTheme()).toBe('light')
    vi.unstubAllGlobals()
  })
})

describe('getResolvedTheme', () => {
  it('returns "light" for light theme', () => {
    expect(getResolvedTheme('light')).toBe('light')
  })

  it('returns "dark" for dark theme', () => {
    expect(getResolvedTheme('dark')).toBe('dark')
  })

  it('returns system preference for system theme', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }))
    )
    expect(getResolvedTheme('system')).toBe('dark')
    vi.unstubAllGlobals()
  })

  it('returns light when system prefers light', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false }))
    )
    expect(getResolvedTheme('system')).toBe('light')
    vi.unstubAllGlobals()
  })
})
