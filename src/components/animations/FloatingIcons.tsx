import { LanguageIconLarge } from '@/components/common/LanguageIcon'
import { cn } from '@/lib/utils'

const floatingIcons = [
  { language: 'ts', top: '10%', left: '5%', delay: '0s' },
  { language: 'js', top: '20%', right: '10%', delay: '1s' },
  { language: 'react', top: '60%', left: '8%', delay: '2s' },
  { language: 'css', top: '70%', right: '5%', delay: '0.5s' },
  { language: 'html', top: '40%', left: '3%', delay: '1.5s' },
  { language: 'tsx', top: '85%', right: '15%', delay: '2.5s' },
  { language: 'json', top: '30%', right: '3%', delay: '3s' },
]

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {floatingIcons.map((icon, index) => (
        <div
          key={index}
          className={cn(
            'absolute animate-float',
            'opacity-30 dark:opacity-20'
          )}
          style={{
            top: icon.top,
            left: icon.left,
            right: icon.right,
            animationDelay: icon.delay,
            animationDuration: `${6 + index * 0.5}s`,
          }}
        >
          <LanguageIconLarge language={icon.language} />
        </div>
      ))}
    </div>
  )
}
