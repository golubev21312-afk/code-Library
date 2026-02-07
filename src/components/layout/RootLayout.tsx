import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'

export function RootLayout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <>
      <Header />
      <main className={isHomePage ? '' : 'pt-16'}>
        <Outlet />
      </main>
    </>
  )
}
