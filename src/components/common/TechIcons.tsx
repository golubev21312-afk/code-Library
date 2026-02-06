import { cn } from '@/lib/utils'

interface IconProps {
  className?: string
}

export function TypeScriptIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className}>
      <rect fill="#3178c6" width="128" height="128" rx="10" />
      <path
        fill="#fff"
        d="M82.9 93.5c2.1 3.3 5.4 5.8 10.2 7.4 4.8 1.6 10 2 15.2 1.2v-14c-3.4.7-6.3.6-8.5-.2-2.2-.8-3.5-2.4-3.9-4.7-.2-1.1-.3-4.7-.3-10.8V52h13.2V38.6h-13.2V16.2H81.2v22.4H69.4V52h11.8v28.2c0 8.7.5 13.8 1.7 15.3zM56.8 93.5V52H44.2v55.6h36V93.5H56.8z"
      />
    </svg>
  )
}

export function JavaScriptIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className}>
      <rect fill="#f7df1e" width="128" height="128" rx="10" />
      <path
        fill="#000"
        d="M34.9 106.6l9.8-5.9c1.9 3.4 3.6 6.2 7.8 6.2 4 0 6.5-1.6 6.5-7.7V64.7h12.1v34.7c0 12.7-7.4 18.4-18.3 18.4-9.8 0-15.5-5.1-18.4-11.2zm43.5-1.2l9.8-5.7c2.6 4.2 5.9 7.4 11.9 7.4 5 0 8.2-2.5 8.2-6 0-4.1-3.3-5.6-8.8-8l-3-1.3c-8.7-3.7-14.5-8.4-14.5-18.2 0-9.1 6.9-16 17.7-16 7.7 0 13.2 2.7 17.2 9.6l-9.4 6c-2.1-3.7-4.3-5.2-7.8-5.2-3.5 0-5.8 2.3-5.8 5.2 0 3.6 2.3 5.1 7.5 7.3l3 1.3c10.3 4.4 16.1 8.9 16.1 19 0 10.9-8.5 16.9-20 16.9-11.2 0-18.4-5.3-21.9-12.3z"
      />
    </svg>
  )
}

export function ReactIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className}>
      <circle cx="64" cy="64" r="64" fill="#20232a" />
      <circle cx="64" cy="64" r="11.4" fill="#61dafb" />
      <ellipse
        cx="64"
        cy="64"
        rx="47"
        ry="18"
        fill="none"
        stroke="#61dafb"
        strokeWidth="4"
      />
      <ellipse
        cx="64"
        cy="64"
        rx="47"
        ry="18"
        fill="none"
        stroke="#61dafb"
        strokeWidth="4"
        transform="rotate(60 64 64)"
      />
      <ellipse
        cx="64"
        cy="64"
        rx="47"
        ry="18"
        fill="none"
        stroke="#61dafb"
        strokeWidth="4"
        transform="rotate(120 64 64)"
      />
    </svg>
  )
}

export function CSSIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className}>
      <rect fill="#1572b6" width="128" height="128" rx="10" />
      <path
        fill="#fff"
        d="M19.7 104.2L14.5 16h99l-5.2 88.1L64 115.5l-44.3-11.3zm70.5-73.3H37.9l1 11.5h50.2l-3 33.5-22 6.1-22.1-6.1-1.5-16.8h11.3l.8 8.5 11.5 3.1 11.5-3.1 1.2-13.5H36.4l-3-33.2h61.6l-.8 10z"
      />
    </svg>
  )
}

export function HTMLIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className}>
      <rect fill="#e44d26" width="128" height="128" rx="10" />
      <path
        fill="#fff"
        d="M19.7 104.2L14.5 16h99l-5.2 88.1L64 115.5l-44.3-11.3zm70.4-73.3H37.9l1 11.5h50.1l-3 33.6-22 6-22.1-6-1.5-16.9h11.3l.8 8.6 11.5 3 11.5-3 1.2-13.5H36.4l-2.9-33.2h61.5l-.9 10.9z"
      />
    </svg>
  )
}

// Animated tech icons for hero section
export function HeroTechIcons() {
  const icons = [
    { Icon: TypeScriptIcon, delay: '0s', position: 'left-[5%] top-[15%]' },
    { Icon: JavaScriptIcon, delay: '0.5s', position: 'right-[8%] top-[20%]' },
    { Icon: ReactIcon, delay: '1s', position: 'left-[10%] top-[60%]' },
    { Icon: CSSIcon, delay: '1.5s', position: 'right-[5%] top-[55%]' },
    { Icon: HTMLIcon, delay: '2s', position: 'left-[3%] top-[38%]' },
    { Icon: TypeScriptIcon, delay: '2.5s', position: 'right-[12%] top-[75%]' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {icons.map(({ Icon, delay, position }, index) => (
        <div
          key={index}
          className={cn(
            'absolute w-12 h-12 md:w-16 md:h-16 opacity-20 dark:opacity-15',
            'animate-float drop-shadow-lg',
            position
          )}
          style={{
            animationDelay: delay,
            animationDuration: `${6 + index * 0.7}s`,
          }}
        >
          <Icon className="w-full h-full rounded-lg" />
        </div>
      ))}
    </div>
  )
}
