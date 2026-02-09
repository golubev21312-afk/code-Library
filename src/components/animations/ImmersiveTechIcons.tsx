import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  TypeScriptIcon,
  JavaScriptIcon,
  ReactIcon,
  CSSIcon,
} from '@/components/common/TechIcons'

interface ImmersiveIconConfig {
  Icon: React.ComponentType<{ className?: string }>
  category: string
  label: string
  position: string
  size: string
  glowColor: string
  animationDelay: string
  animationDuration: string
  rotateStart: string
}

const icons: ImmersiveIconConfig[] = [
  // TypeScript - левый верхний угол (опущен ниже)
  {
    Icon: TypeScriptIcon,
    category: 'typescript',
    label: 'TypeScript snippets',
    position: 'left-[1%] top-[15%] md:left-[3%] md:top-[18%]',
    size: 'w-14 h-14 md:w-24 md:h-24 lg:w-32 lg:h-32',
    glowColor: 'rgba(49, 120, 198, 0.5)',
    animationDelay: '0s',
    animationDuration: '18s',
    rotateStart: 'rotateY(-10deg) rotateX(5deg)',
  },
  // React - правый верхний угол (опущен ниже)
  {
    Icon: ReactIcon,
    category: 'react',
    label: 'React snippets',
    position: 'right-[1%] top-[15%] md:right-[3%] md:top-[18%]',
    size: 'w-14 h-14 md:w-24 md:h-24 lg:w-32 lg:h-32',
    glowColor: 'rgba(97, 218, 251, 0.5)',
    animationDelay: '2s',
    animationDuration: '20s',
    rotateStart: 'rotateY(10deg) rotateX(5deg)',
  },
  // JavaScript - левый нижний (опущен ниже)
  {
    Icon: JavaScriptIcon,
    category: 'javascript',
    label: 'JavaScript snippets',
    position: 'left-[0%] top-[60%] md:left-[2%] md:top-[65%]',
    size: 'w-12 h-12 md:w-20 md:h-20 lg:w-28 lg:h-28',
    glowColor: 'rgba(247, 223, 30, 0.4)',
    animationDelay: '4s',
    animationDuration: '16s',
    rotateStart: 'rotateY(-15deg) rotateX(-5deg)',
  },
  // CSS - правый нижний (опущен ниже)
  {
    Icon: CSSIcon,
    category: 'css',
    label: 'CSS snippets',
    position: 'right-[0%] top-[60%] md:right-[2%] md:top-[65%]',
    size: 'w-12 h-12 md:w-20 md:h-20 lg:w-28 lg:h-28',
    glowColor: 'rgba(38, 77, 228, 0.5)',
    animationDelay: '6s',
    animationDuration: '17s',
    rotateStart: 'rotateY(15deg) rotateX(-5deg)',
  },
]

function BreakableLogo({
  Icon,
  category,
  label,
  position,
  size,
  glowColor,
  animationDelay,
  animationDuration,
  rotateStart,
}: ImmersiveIconConfig) {
  const [isBreaking, setIsBreaking] = useState(false)
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsBreaking(true)
    setTimeout(() => {
      navigate(`/snippets?category=${category}`)
    }, 400)
  }

  return (
    <button
      onClick={handleClick}
      title={label}
      aria-label={label}
      className={cn(
        'absolute logo-3d-container pointer-events-auto',
        'opacity-70 dark:opacity-80 hover:opacity-100',
        'transition-opacity duration-300 cursor-pointer',
        position
      )}
    >
      <div
        className={cn('logo-3d logo-break-container', size, isBreaking && 'breaking')}
        style={
          {
            animationDelay,
            animationDuration,
            '--icon-glow-color': glowColor,
            transform: rotateStart,
          } as React.CSSProperties
        }
      >
        {/* Full logo (shown when not breaking) */}
        {!isBreaking && (
          <div className="logo-3d-icon w-full h-full overflow-hidden">
            <Icon className="w-full h-full" />
          </div>
        )}

        {/* Split halves (shown when breaking) */}
        {isBreaking && (
          <>
            <div className="logo-half logo-half-left">
              <div className="logo-3d-icon w-[200%] h-full overflow-hidden">
                <Icon className="w-full h-full" />
              </div>
            </div>
            <div className="logo-half logo-half-right">
              <div className="logo-3d-icon w-[200%] h-full overflow-hidden -translate-x-1/2">
                <Icon className="w-full h-full" />
              </div>
            </div>
          </>
        )}
      </div>
    </button>
  )
}

export function ImmersiveTechIcons() {
  return (
    <div className="absolute top-0 left-0 right-0 h-screen overflow-hidden z-10 pointer-events-none">
      {icons.map((iconConfig, index) => (
        <BreakableLogo key={index} {...iconConfig} />
      ))}
    </div>
  )
}
