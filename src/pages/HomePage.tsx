import { HeroSection } from '@/components/home/HeroSection'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { HeroTechIcons } from '@/components/common/TechIcons'
import { AnimatedCard } from '@/components/animations/AnimatedCard'
import { SnippetPreviewCard } from '@/components/home/SnippetPreviewCard'
import { getAllSnippets } from '@/data/snippets'

export function HomePage() {
  // Get 6 featured snippets (mix of categories and levels)
  const allSnippets = getAllSnippets()
  const featuredSnippets = allSnippets
    .filter((s) => s.whyRelevant2026)
    .slice(0, 6)

  return (
    <div className="relative min-h-screen">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient" />

      {/* Floating tech icons */}
      <HeroTechIcons />

      {/* Hero Section */}
      <HeroSection />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Snippets Preview */}
      {featuredSnippets.length > 0 && (
        <section className="relative py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Актуальные сниппеты
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Самые полезные примеры для современной разработки
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {featuredSnippets.map((snippet, index) => (
                <AnimatedCard key={snippet.id} delay={index * 100}>
                  <SnippetPreviewCard snippet={snippet} />
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
