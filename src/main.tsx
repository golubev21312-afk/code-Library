import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { SplashScreen } from '@/components/splash/SplashScreen'
import './index.css'
import App from './App.tsx'

// Регистрация Service Worker с автообновлением
const updateSW = registerSW({
  onNeedRefresh() {
    // Показать уведомление о доступном обновлении
    if (confirm('Доступна новая версия. Обновить?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Приложение готово к работе офлайн')
  },
  onRegistered(registration) {
    // Проверять обновления каждый час
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)
    }
  },
  onRegisterError(error) {
    console.error('Ошибка регистрации SW:', error)
  },
})

function shouldShowSplash(): boolean {
  try {
    return !sessionStorage.getItem('splash-shown')
  } catch {
    return true
  }
}

function Root() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash)

  return (
    <ThemeProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="min-h-screen bg-background text-foreground">
        <App />
      </div>
      <Toaster />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
