import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  TypeScriptIcon,
  JavaScriptIcon,
  ReactIcon,
  CSSIcon,
  HTMLIcon,
} from '@/components/common/TechIcons'

interface SplashScreenProps {
  onComplete: () => void
}

// ============================================
// Code snippet variants
// ============================================

type CodeSegment = { text: string; cls: string }

const codeSnippets: { fileName: string; lines: CodeSegment[] }[] = [
  {
    fileName: 'useCounter.ts',
    lines: [
      { text: 'import', cls: 'splash-kw' },
      { text: ' { useState }', cls: 'splash-var' },
      { text: ' from ', cls: 'splash-kw' },
      { text: "'react'", cls: 'splash-str' },
      { text: '\n\n', cls: '' },
      { text: 'export function ', cls: 'splash-kw' },
      { text: 'useCounter', cls: 'splash-fn' },
      { text: '(', cls: '' },
      { text: 'initial', cls: 'splash-param' },
      { text: ' = ', cls: '' },
      { text: '0', cls: 'splash-num' },
      { text: ') {\n', cls: '' },
      { text: '  const ', cls: 'splash-kw' },
      { text: '[count, setCount]', cls: 'splash-var' },
      { text: ' = ', cls: '' },
      { text: 'useState', cls: 'splash-fn' },
      { text: '(initial)\n', cls: '' },
      { text: '  return ', cls: 'splash-kw' },
      { text: '{ count, ', cls: '' },
      { text: 'increment', cls: 'splash-param' },
      { text: ': () => ', cls: '' },
      { text: 'setCount', cls: 'splash-fn' },
      { text: '(c => c + ', cls: '' },
      { text: '1', cls: 'splash-num' },
      { text: ') }\n', cls: '' },
      { text: '}', cls: '' },
    ],
  },
  {
    fileName: 'Button.tsx',
    lines: [
      { text: 'import', cls: 'splash-kw' },
      { text: ' { cn }', cls: 'splash-var' },
      { text: ' from ', cls: 'splash-kw' },
      { text: "'@/lib/utils'", cls: 'splash-str' },
      { text: '\n\n', cls: '' },
      { text: 'interface ', cls: 'splash-kw' },
      { text: 'ButtonProps', cls: 'splash-fn' },
      { text: ' {\n', cls: '' },
      { text: '  variant', cls: 'splash-param' },
      { text: '?: ', cls: '' },
      { text: "'primary'", cls: 'splash-str' },
      { text: ' | ', cls: '' },
      { text: "'ghost'", cls: 'splash-str' },
      { text: '\n', cls: '' },
      { text: '  children', cls: 'splash-param' },
      { text: ': ', cls: '' },
      { text: 'React.ReactNode', cls: 'splash-fn' },
      { text: '\n}\n\n', cls: '' },
      { text: 'export function ', cls: 'splash-kw' },
      { text: 'Button', cls: 'splash-fn' },
      { text: '({ variant, children }: ', cls: '' },
      { text: 'ButtonProps', cls: 'splash-fn' },
      { text: ') {\n', cls: '' },
      { text: '  return ', cls: 'splash-kw' },
      { text: '<button className=', cls: '' },
      { text: '{cn(', cls: 'splash-fn' },
      { text: "'btn'", cls: 'splash-str' },
      { text: ', variant)}>', cls: '' },
      { text: '{children}', cls: 'splash-var' },
      { text: '</button>\n', cls: '' },
      { text: '}', cls: '' },
    ],
  },
  {
    fileName: 'api.ts',
    lines: [
      { text: 'const ', cls: 'splash-kw' },
      { text: 'API_URL', cls: 'splash-var' },
      { text: ' = ', cls: '' },
      { text: "'https://api.example.com'", cls: 'splash-str' },
      { text: '\n\n', cls: '' },
      { text: 'export async function ', cls: 'splash-kw' },
      { text: 'fetchSnippets', cls: 'splash-fn' },
      { text: '() {\n', cls: '' },
      { text: '  const ', cls: 'splash-kw' },
      { text: 'res', cls: 'splash-var' },
      { text: ' = ', cls: '' },
      { text: 'await ', cls: 'splash-kw' },
      { text: 'fetch', cls: 'splash-fn' },
      { text: '(`${', cls: '' },
      { text: 'API_URL', cls: 'splash-var' },
      { text: '}/snippets`)\n', cls: '' },
      { text: '  if ', cls: 'splash-kw' },
      { text: '(!res.ok) ', cls: '' },
      { text: 'throw new ', cls: 'splash-kw' },
      { text: 'Error', cls: 'splash-fn' },
      { text: '(', cls: '' },
      { text: "'Fetch failed'", cls: 'splash-str' },
      { text: ')\n', cls: '' },
      { text: '  return ', cls: 'splash-kw' },
      { text: 'res.json()\n', cls: '' },
      { text: '}', cls: '' },
    ],
  },
]

// ============================================
// Icons config
// ============================================

const icons = [
  { Icon: TypeScriptIcon, label: 'TypeScript', glow: 'rgba(49, 120, 198, 0.6)' },
  { Icon: JavaScriptIcon, label: 'JavaScript', glow: 'rgba(247, 223, 30, 0.6)' },
  { Icon: ReactIcon, label: 'React', glow: 'rgba(97, 218, 251, 0.6)' },
  { Icon: CSSIcon, label: 'CSS', glow: 'rgba(38, 77, 228, 0.6)' },
  { Icon: HTMLIcon, label: 'HTML', glow: 'rgba(228, 77, 38, 0.6)' },
]

// ============================================
// Generators
// ============================================

interface Particle {
  id: number; x: number; y: number; size: number
  duration: number; delay: number; opacity: number
}

function generateBackgroundParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 5,
    opacity: 0.15 + Math.random() * 0.35,
  }))
}

interface Spark {
  id: number; angle: number; distance: number
  size: number; duration: number
}

function generateSparks(count: number): Spark[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + Math.random() * 30 - 15,
    distance: 30 + Math.random() * 40,
    size: 2 + Math.random() * 3,
    duration: 0.4 + Math.random() * 0.4,
  }))
}

// ============================================
// Typing sound via Web Audio API
// ============================================

function createTypingSound(audioCtx: AudioContext) {
  const now = audioCtx.currentTime
  const osc = audioCtx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(800 + Math.random() * 400, now)
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.05)

  const gain = audioCtx.createGain()
  gain.gain.setValueAtTime(0.08, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

  const filter = audioCtx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 500

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(now)
  osc.stop(now + 0.1)
}

function ensureAudioContext(ref: React.MutableRefObject<AudioContext | null>) {
  if (!ref.current) {
    try { ref.current = new AudioContext() } catch { return }
  }
  if (ref.current.state === 'suspended') {
    ref.current.resume()
  }
}

// ============================================
// Main component
// ============================================

type Phase = 'icons' | 'typing' | 'fadeout'

const TOTAL_DURATION = 7000

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<Phase>('icons')
  const [iconsGathering, setIconsGathering] = useState(false)
  const [typedChars, setTypedChars] = useState(0)
  const [muted, setMuted] = useState(false)
  const [visibleSparks, setVisibleSparks] = useState<number[]>([])

  const audioCtxRef = useRef<AudioContext | null>(null)
  const startTimeRef = useRef(Date.now())
  const [progress, setProgress] = useState(0)

  // Pick random snippet once
  const snippet = useMemo(
    () => codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
    []
  )
  const totalChars = useMemo(
    () => snippet.lines.reduce((acc, seg) => acc + seg.text.length, 0),
    [snippet]
  )

  // Stable generated data
  const bgParticles = useMemo(() => generateBackgroundParticles(30), [])
  const iconSparks = useMemo(() => icons.map(() => generateSparks(6)), [])

  // Progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Initialize audio on user interaction
  useEffect(() => {
    const initAudio = () => ensureAudioContext(audioCtxRef)
    window.addEventListener('click', initAudio, { once: true })
    window.addEventListener('keydown', initAudio, { once: true })
    return () => {
      window.removeEventListener('click', initAudio)
      window.removeEventListener('keydown', initAudio)
    }
  }, [])

  // Skip handler
  const handleSkip = useCallback(() => {
    try { sessionStorage.setItem('splash-shown', '1') } catch {}
    onComplete()
  }, [onComplete])

  // Keyboard: skip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault()
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleSkip])

  // Phase 1: icons -> typing
  useEffect(() => {
    const sparkTimers = icons.map((_, i) =>
      setTimeout(() => setVisibleSparks(prev => [...prev, i]), i * 400 + 300)
    )
    const gatherTimer = setTimeout(() => setIconsGathering(true), 2200)
    const typingTimer = setTimeout(() => setPhase('typing'), 2800)
    return () => {
      sparkTimers.forEach(clearTimeout)
      clearTimeout(gatherTimer)
      clearTimeout(typingTimer)
    }
  }, [])

  // Typewriter
  useEffect(() => {
    if (phase !== 'typing' || totalChars === 0) return
    if (typedChars >= totalChars) {
      const fadeTimer = setTimeout(() => setPhase('fadeout'), 400)
      return () => clearTimeout(fadeTimer)
    }
    const speed = 20 + Math.random() * 15
    const timer = setTimeout(() => {
      setTypedChars(prev => prev + 1)
      if (!muted && audioCtxRef.current && audioCtxRef.current.state === 'running') {
        try {
          createTypingSound(audioCtxRef.current)
        } catch {}
      }
    }, speed)
    return () => clearTimeout(timer)
  }, [phase, typedChars, totalChars, muted])

  // Fade out
  useEffect(() => {
    if (phase !== 'fadeout') return
    const timer = setTimeout(() => {
      try { sessionStorage.setItem('splash-shown', '1') } catch {}
      onComplete()
    }, 1500)
    return () => clearTimeout(timer)
  }, [phase, onComplete])

  // Build typed code
  const renderTypedCode = useCallback(() => {
    let remaining = typedChars
    const elements: React.ReactNode[] = []
    for (let i = 0; i < snippet.lines.length && remaining > 0; i++) {
      const seg = snippet.lines[i]
      const chars = Math.min(remaining, seg.text.length)
      const visibleText = seg.text.slice(0, chars)
      remaining -= chars
      elements.push(
        <span key={i} className={seg.cls || undefined}>{visibleText}</span>
      )
    }
    return elements
  }, [typedChars, snippet])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117] select-none ${
        phase === 'fadeout' ? 'splash-phase-fadeout' : ''
      }`}
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      aria-label="Skip splash screen"
    >
      {/* Background floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bgParticles.map((p) => (
          <div
            key={p.id}
            className="splash-bg-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(97, 218, 251, 0.3) 0%, rgba(167, 139, 250, 0.15) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Icons phase */}
      <div
        className={`flex items-center gap-6 md:gap-10 absolute transition-all duration-500 ${
          iconsGathering ? 'splash-icons-gather' : ''
        } ${phase !== 'icons' && !iconsGathering ? 'opacity-0 pointer-events-none scale-75' : ''}`}
      >
        {icons.map(({ Icon, label, glow }, index) => (
          <div
            key={label}
            className="splash-icon-entry relative"
            style={{ animationDelay: `${index * 400}ms` }}
          >
            <div className="w-14 h-14 md:w-20 md:h-20 relative">
              <div
                className="absolute inset-[-50%] rounded-full opacity-0 splash-icon-glow"
                style={{
                  background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
                  animationDelay: `${index * 400}ms`,
                }}
              />
              {visibleSparks.includes(index) &&
                iconSparks[index].map((spark) => (
                  <div
                    key={spark.id}
                    className="splash-spark"
                    style={{
                      '--spark-angle': `${spark.angle}deg`,
                      '--spark-distance': `${spark.distance}px`,
                      width: spark.size,
                      height: spark.size,
                      animationDuration: `${spark.duration}s`,
                      background: glow.replace('0.6', '1'),
                    } as React.CSSProperties}
                  />
                ))}
              <Icon className="w-full h-full rounded-xl relative z-10" />
            </div>
          </div>
        ))}
      </div>

      {/* Code typing */}
      <div
        className={`w-[90vw] max-w-lg mx-auto transition-all duration-500 ${
          phase === 'typing' || phase === 'fadeout' ? 'splash-editor-in' : 'opacity-0 pointer-events-none absolute'
        }`}
      >
        <div className="rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-gray-700/50">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-2 text-xs text-gray-500 font-mono">{snippet.fileName}</span>
          </div>
          <div className="bg-[#0d1117] p-4 md:p-6 min-h-[180px]">
            <pre className="font-mono text-sm md:text-base leading-relaxed text-gray-300 whitespace-pre-wrap">
              <code>
                {renderTypedCode()}
                <span className="splash-cursor">|</span>
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Progress bar + counter */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <div
          className="h-full splash-progress-bar transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="absolute bottom-3 right-4 text-gray-600 text-xs font-mono tabular-nums">
        {Math.round(progress)}%
      </div>

      {/* Skip hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-600 text-xs font-mono splash-skip-hint">
        click or press Space to skip
      </div>

      {/* Mute/unmute */}
      <button
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/5"
        onClick={(e) => {
          e.stopPropagation()
          setMuted((m) => !m)
          ensureAudioContext(audioCtxRef)
        }}
        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {muted ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span className="text-[10px] font-mono">OFF</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span className="text-[10px] font-mono">ON</span>
          </>
        )}
      </button>
    </div>
  )
}
