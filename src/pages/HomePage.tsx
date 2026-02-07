import { HeroSection } from '@/components/home/HeroSection'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { ImmersiveTechIcons } from '@/components/animations/ImmersiveTechIcons'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import { getAllSnippets } from '@/data/snippets'

export function HomePage() {
  const allSnippets = getAllSnippets()
  const featuredSnippets = allSnippets
    .filter((s) => s.whyRelevant2026)
    .slice(0, 6)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Glow Orbs */}
      <div
        className="bg-glow-orb bg-glow-orb-blue"
        style={{ top: '-10%', left: '-15%' }}
        aria-hidden="true"
      />
      <div
        className="bg-glow-orb bg-glow-orb-purple"
        style={{ top: '30%', right: '-10%' }}
        aria-hidden="true"
      />
      <div
        className="bg-glow-orb bg-glow-orb-pink"
        style={{ bottom: '10%', left: '20%' }}
        aria-hidden="true"
      />

      {/* Floating Tech Icons */}
      <ImmersiveTechIcons />

      {/* Hero Section */}
      <HeroSection />

      {/* Category Showcase with Scroll Reveal */}
      <ScrollReveal delay={100}>
        <CategoryShowcase />
      </ScrollReveal>

      {/* Featured Snippets Carousel */}
      {featuredSnippets.length > 0 && (
        <ScrollReveal delay={200}>
          <section className="relative py-20 bg-muted/20 overflow-hidden">
            <div className="container">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-shimmer inline-block">
                  Featured Snippets
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Most useful examples for modern development
                </p>
              </div>
            </div>

            <FeaturedCarousel snippets={featuredSnippets} />
          </section>
        </ScrollReveal>
      )}
    </div>
  )
}
