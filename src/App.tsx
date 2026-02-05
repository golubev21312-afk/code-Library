import { Header } from '@/components/layout/Header'
import { SnippetsPage } from '@/pages/SnippetsPage'

export default function App() {
  return (
    <>
      <Header />
      <main className="container p-6">
        <SnippetsPage />
      </main>
    </>
  )
}
