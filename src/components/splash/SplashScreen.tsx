import { useState, useEffect, useCallback } from 'react'
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

type CodeSegment = { text: string; cls: string }

const codeSnippet: { fileName: string; lines: CodeSegment[] } = {
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
}

const icons = [
  { Icon: TypeScriptIcon, label: 'TypeScript', glow: 'rgba(49, 120, 198, 0.6)' },
  { Icon: JavaScriptIcon, label: 'JavaScript', glow: 'rgba(247, 223, 30, 0.6)' },
  { Icon: ReactIcon, label: 'React', glow: 'rgba(97, 218, 251, 0.6)' },
  { Icon: CSSIcon, label: 'CSS', glow: 'rgba(38, 77, 228, 0.6)' },
  { Icon: HTMLIcon, label: 'HTML', glow: 'rgba(228, 77, 38, 0.6)' },
]

const totalChars = codeSnippet.lines.reduce((acc, seg) => acc + seg.text.length, 0)

type Phase = 'icons' | 'typing' | 'fadeout'

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<Phase>('icons')
  const [iconsGathering, setIconsGathering] = useState(false)
  const [typedChars, setTypedChars] = useState(0)

  // Icons phase -> typing
  useEffect(() => {
    const gatherTimer = setTimeout(() => setIconsGathering(true), 2200)
    const typingTimer = setTimeout(() => setPhase('typing'), 2800)
    return () => {
      clearTimeout(gatherTimer)
      clearTimeout(typingTimer)
    }
  }, [])

  // Typewriter
  useEffect(() => {
    if (phase !== 'typing') return
    if (typedChars >= totalChars) {
      const fadeTimer = setTimeout(() => setPhase('fadeout'), 400)
      return () => clearTimeout(fadeTimer)
    }
    const speed = 25 + Math.random() * 20
    const timer = setTimeout(() => setTypedChars(prev => prev + 1), speed)
    return () => clearTimeout(timer)
  }, [phase, typedChars])

  // Fade out
  useEffect(() => {
    if (phase !== 'fadeout') return
    const timer = setTimeout(onComplete, 1500)
    return () => clearTimeout(timer)
  }, [phase, onComplete])

  // Build typed code
  const renderTypedCode = useCallback(() => {
    let remaining = typedChars
    const elements: React.ReactNode[] = []
    for (let i = 0; i < codeSnippet.lines.length && remaining > 0; i++) {
      const seg = codeSnippet.lines[i]
      const chars = Math.min(remaining, seg.text.length)
      const visibleText = seg.text.slice(0, chars)
      remaining -= chars
      elements.push(
        <span key={i} className={seg.cls || undefined}>{visibleText}</span>
      )
    }
    return elements
  }, [typedChars])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117] select-none ${
        phase === 'fadeout' ? 'splash-phase-fadeout' : ''
      }`}
    >
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
            className="splash-icon-entry"
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
            <span className="ml-2 text-xs text-gray-500 font-mono">{codeSnippet.fileName}</span>
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
    </div>
  )
}
