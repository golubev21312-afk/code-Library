import { renderHook, act } from '@testing-library/react'
import { useScrollReveal } from '../useScrollReveal'

describe('useScrollReveal', () => {
  let observeMock: ReturnType<typeof vi.fn>
  let disconnectMock: ReturnType<typeof vi.fn>
  let observerCallback: IntersectionObserverCallback
  let originalIO: typeof IntersectionObserver

  beforeEach(() => {
    vi.useFakeTimers()
    observeMock = vi.fn()
    disconnectMock = vi.fn()

    originalIO = globalThis.IntersectionObserver

    // Use a class so `new IntersectionObserver(...)` works
    globalThis.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback
      }
      observe = observeMock
      disconnect = disconnectMock
      unobserve = vi.fn()
      root = null
      rootMargin = ''
      thresholds = []
      takeRecords = vi.fn()
    } as unknown as typeof IntersectionObserver

    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false }))
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    globalThis.IntersectionObserver = originalIO
    vi.unstubAllGlobals()
  })

  it('returns ref and isVisible=false initially', () => {
    const { result } = renderHook(() => useScrollReveal())
    expect(result.current.isVisible).toBe(false)
    expect(result.current.ref).toBeDefined()
  })

  it('sets isVisible=true when element intersects', () => {
    const div = document.createElement('div')

    const { result } = renderHook(() => {
      const hookResult = useScrollReveal()
      ;(hookResult.ref as React.MutableRefObject<HTMLDivElement>).current = div
      return hookResult
    })

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
      vi.advanceTimersByTime(0)
    })

    expect(result.current.isVisible).toBe(true)
  })

  it('applies delay before setting isVisible', () => {
    const div = document.createElement('div')

    const { result } = renderHook(() => {
      const hookResult = useScrollReveal({ delay: 500 })
      ;(hookResult.ref as React.MutableRefObject<HTMLDivElement>).current = div
      return hookResult
    })

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })

    expect(result.current.isVisible).toBe(false)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current.isVisible).toBe(true)
  })

  it('does not set isVisible when element is not intersecting', () => {
    const div = document.createElement('div')

    const { result } = renderHook(() => {
      const hookResult = useScrollReveal()
      ;(hookResult.ref as React.MutableRefObject<HTMLDivElement>).current = div
      return hookResult
    })

    act(() => {
      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })

    expect(result.current.isVisible).toBe(false)
  })

  it('disconnects observer after intersection', () => {
    const div = document.createElement('div')

    renderHook(() => {
      const hookResult = useScrollReveal()
      ;(hookResult.ref as React.MutableRefObject<HTMLDivElement>).current = div
      return hookResult
    })

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })

    expect(disconnectMock).toHaveBeenCalled()
  })

  it('sets isVisible=true immediately when prefers-reduced-motion is enabled', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }))
    )

    const { result } = renderHook(() => useScrollReveal())
    expect(result.current.isVisible).toBe(true)
  })

  it('does not create observer when prefers-reduced-motion is enabled', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }))
    )

    renderHook(() => useScrollReveal())
    // observe should not have been called
    expect(observeMock).not.toHaveBeenCalled()
  })

  it('disconnects observer on unmount', () => {
    const { unmount } = renderHook(() => useScrollReveal())
    unmount()
    expect(disconnectMock).toHaveBeenCalled()
  })
})
