import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CodeBlock } from '../code/CodeBlock'

// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children, language }: { children: string; language: string }) => (
    <pre data-testid="syntax-highlighter" data-language={language}>
      <code>{children}</code>
    </pre>
  ),
}))

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: {},
  oneLight: {},
}))

// Mock sonner
const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}))

// Mock themeStore
vi.mock('@/store/themeStore', () => ({
  useThemeStore: (selector: (state: { theme: string }) => unknown) =>
    selector({ theme: 'dark' }),
  getResolvedTheme: () => 'dark',
}))

function mockClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
    configurable: true,
  })
}

describe('CodeBlock', () => {
  beforeEach(() => {
    mockToastSuccess.mockClear()
    mockToastError.mockClear()
  })

  it('renders code content', () => {
    render(<CodeBlock code="const x = 1" language="typescript" />)
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })

  it('renders with title when provided', () => {
    render(<CodeBlock code="code" language="ts" title="Example" />)
    expect(screen.getByText('Example')).toBeInTheDocument()
  })

  it('displays normalized language when no title', () => {
    render(<CodeBlock code="code" language="ts" />)
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })

  it('normalizes ts to typescript', () => {
    render(<CodeBlock code="code" language="ts" />)
    const highlighter = screen.getByTestId('syntax-highlighter')
    expect(highlighter.getAttribute('data-language')).toBe('typescript')
  })

  it('normalizes js to javascript', () => {
    render(<CodeBlock code="code" language="js" />)
    const highlighter = screen.getByTestId('syntax-highlighter')
    expect(highlighter.getAttribute('data-language')).toBe('javascript')
  })

  it('normalizes shell to bash', () => {
    render(<CodeBlock code="code" language="shell" />)
    const highlighter = screen.getByTestId('syntax-highlighter')
    expect(highlighter.getAttribute('data-language')).toBe('bash')
  })

  it('keeps already-full language names unchanged', () => {
    render(<CodeBlock code="code" language="css" />)
    const highlighter = screen.getByTestId('syntax-highlighter')
    expect(highlighter.getAttribute('data-language')).toBe('css')
  })

  it('renders copy button', () => {
    render(<CodeBlock code="code" language="ts" />)
    expect(screen.getByLabelText('Копировать код')).toBeInTheDocument()
  })

  it('copies code to clipboard on button click', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    mockClipboard(writeText)

    render(<CodeBlock code="const x = 42" language="ts" />)
    await user.click(screen.getByLabelText('Копировать код'))

    expect(writeText).toHaveBeenCalledWith('const x = 42')
    expect(mockToastSuccess).toHaveBeenCalledWith('Код скопирован')
  })

  it('shows check icon after successful copy', async () => {
    const user = userEvent.setup()
    mockClipboard(vi.fn().mockResolvedValue(undefined))

    render(<CodeBlock code="code" language="ts" />)
    await user.click(screen.getByLabelText('Копировать код'))

    expect(screen.getByLabelText('Код скопирован')).toBeInTheDocument()
  })

  it('shows error toast when clipboard fails', async () => {
    const user = userEvent.setup()
    mockClipboard(vi.fn().mockRejectedValue(new Error('fail')))

    render(<CodeBlock code="code" language="ts" />)
    await user.click(screen.getByLabelText('Копировать код'))

    expect(mockToastError).toHaveBeenCalledWith('Не удалось скопировать')
  })

  it('trims code before rendering', () => {
    render(<CodeBlock code={"  hello  \n"} language="ts" />)
    // The component calls code.trim() before passing to SyntaxHighlighter
    const highlighter = screen.getByTestId('syntax-highlighter')
    expect(highlighter.textContent).toBe('hello')
  })
})
