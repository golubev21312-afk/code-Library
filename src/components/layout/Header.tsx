import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor, Code2, Heart, Home, Trophy, BookOpen } from 'lucide-react'
import { useThemeStore, type Theme } from '@/store/themeStore'
import { useFavorites } from '@/store/favoritesStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const themeOptions: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'light', icon: <Sun className="h-4 w-4" />, label: 'Светлая тема' },
  { value: 'dark', icon: <Moon className="h-4 w-4" />, label: 'Тёмная тема' },
  { value: 'system', icon: <Monitor className="h-4 w-4" />, label: 'Системная тема' },
]

function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const currentOption = themeOptions.find((opt) => opt.value === theme)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={cn('h-9 w-9')}
      title={currentOption?.label}
    >
      {currentOption?.icon}
      <span className="sr-only">{currentOption?.label}</span>
    </Button>
  )
}

const navLinks = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/snippets', label: 'Сниппеты', icon: Code2 },
  { to: '/tags', label: 'Теги', icon: BookOpen },
  { to: '/favorites', label: 'Избранное', icon: Heart },
  { to: '/quiz', label: 'Quiz', icon: Trophy },
]

export function Header() {
  const location = useLocation()
  const { count } = useFavorites()
  const [isScrolled, setIsScrolled] = useState(false)
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isHomePage && !isScrolled
          ? 'glass-header'
          : 'glass-header-solid'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-bold text-xl tracking-tight hover:text-primary transition-colors"
          >
            Code Library
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to
              const isFavorites = to === '/favorites'

              return (
                <Link key={to} to={to}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2',
                      isActive && 'bg-secondary'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {isFavorites && count > 0 && (
                      <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {count}
                      </span>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile navigation */}
          <nav className="flex md:hidden items-center gap-1">
            {navLinks.map(({ to, icon: Icon }) => {
              const isActive = location.pathname === to
              const isFavorites = to === '/favorites'

              return (
                <Link key={to} to={to}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-9 w-9 relative"
                  >
                    <Icon className="h-4 w-4" />
                    {isFavorites && count > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                        {count > 9 ? '9+' : count}
                      </span>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
