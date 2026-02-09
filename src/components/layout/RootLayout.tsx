import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'

export function RootLayout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Перейти к содержимому
      </a>
      <Header />
      <main id="main-content" className={isHomePage ? '' : 'pt-16'}>
        <Outlet />
      </main>
    </>
  )
}
