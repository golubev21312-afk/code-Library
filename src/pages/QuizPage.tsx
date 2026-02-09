import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, RotateCcw, ArrowRight, Check, X, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/code/CodeBlock'
import { getAllSnippets } from '@/data/snippets'
import { cn } from '@/lib/utils'
import type { Snippet } from '@/types'

interface QuizQuestion {
  snippet: Snippet
  options: string[]
  correctIndex: number
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const MIN_SNIPPETS_FOR_QUIZ = 4

function generateQuizQuestions(count: number): QuizQuestion[] {
  const allSnippets = getAllSnippets()

  // Фильтруем сниппеты с кодом достаточной длины
  const validSnippets = allSnippets.filter(
    s => s.code.length > 50 && s.code.length < 800 && s.description.length > 20
  )

  // Нужно минимум 4 сниппета чтобы собрать 1 вопрос с 4 вариантами
  if (validSnippets.length < MIN_SNIPPETS_FOR_QUIZ) return []

  // Не можем сгенерировать больше вопросов чем есть сниппетов
  const actualCount = Math.min(count, validSnippets.length)

  // Перемешиваем и берём нужное количество
  const selectedSnippets = shuffleArray(validSnippets).slice(0, actualCount)

  return selectedSnippets.map(snippet => {
    // Берём 3 случайных неправильных ответа из других сниппетов
    const otherDescriptions = shuffleArray(
      validSnippets
        .filter(s => s.id !== snippet.id)
        .map(s => s.description)
    ).slice(0, 3)

    // Формируем варианты ответов
    const allOptions = [snippet.description, ...otherDescriptions]
    const shuffledOptions = shuffleArray(allOptions)
    const correctIndex = shuffledOptions.indexOf(snippet.description)

    return {
      snippet,
      options: shuffledOptions,
      correctIndex,
    }
  })
}

export function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => generateQuizQuestions(10))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>([])

  const currentQuestion = questions[currentIndex]
  const isFinished = currentIndex >= questions.length
  const isEmpty = questions.length === 0

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(index)
    const isCorrect = index === currentQuestion.correctIndex
    if (isCorrect) setScore(s => s + 1)
    setAnswered(prev => [...prev, isCorrect])
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setCurrentIndex(i => i + 1)
  }

  const handleRestart = () => {
    setQuestions(generateQuizQuestions(10))
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setAnswered([])
  }

  if (isEmpty) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Code2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Недостаточно сниппетов</h1>
            <p className="text-muted-foreground mt-2">
              Для квиза нужно минимум {MIN_SNIPPETS_FOR_QUIZ} сниппета с примерами кода.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/snippets" className="gap-2">
              <Code2 className="h-4 w-4" />
              К сниппетам
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className={cn(
            'w-24 h-24 mx-auto rounded-full flex items-center justify-center',
            percentage >= 80 ? 'bg-green-500/20' : percentage >= 50 ? 'bg-yellow-500/20' : 'bg-red-500/20'
          )}>
            <Trophy className={cn(
              'h-12 w-12',
              percentage >= 80 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
            )} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{percentage}%</h1>
            <p className="text-muted-foreground mt-2">
              {score} из {questions.length} правильных ответов
            </p>
          </div>

          <p className="text-lg">
            {percentage >= 80 ? 'Отлично! Ты хорошо знаешь код!' :
             percentage >= 50 ? 'Неплохо! Но есть куда расти.' :
             'Стоит изучить сниппеты подробнее!'}
          </p>

          <div className="flex gap-3 justify-center">
            <Button onClick={handleRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Ещё раз
            </Button>
            <Button variant="outline" asChild>
              <Link to="/snippets" className="gap-2">
                <Code2 className="h-4 w-4" />
                К сниппетам
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Quiz: Что делает этот код?</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex gap-1">
              {answered.map((correct, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full',
                    correct ? 'bg-green-500' : 'bg-red-500'
                  )}
                />
              ))}
              {Array.from({ length: questions.length - answered.length }).map((_, i) => (
                <div key={`empty-${i}`} className="w-2 h-2 rounded-full bg-muted" />
              ))}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {currentQuestion.snippet.language.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground font-mono">
                {currentQuestion.snippet.title}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={currentQuestion.snippet.code}
              language={currentQuestion.snippet.language}
              className="text-sm max-h-[300px] overflow-auto"
            />

            <p className="font-medium text-lg">Что делает этот код?</p>

            {/* Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === currentQuestion.correctIndex
                const showCorrect = selectedAnswer !== null && isCorrect
                const showWrong = isSelected && !isCorrect

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={cn(
                      'w-full p-3 rounded-lg border text-left transition-all text-sm',
                      'hover:border-primary/50 hover:bg-muted/50',
                      'disabled:cursor-default',
                      selectedAnswer === null && 'hover:scale-[1.01]',
                      showCorrect && 'border-green-500 bg-green-500/10',
                      showWrong && 'border-red-500 bg-red-500/10',
                      isSelected && !showWrong && !showCorrect && 'border-primary'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="line-clamp-3">{option}</span>
                      {showCorrect && <Check className="h-5 w-5 text-green-500 shrink-0" />}
                      {showWrong && <X className="h-5 w-5 text-red-500 shrink-0" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Next Button */}
            {selectedAnswer !== null && (
              <Button onClick={handleNext} className="w-full gap-2 animate-fadeInUp">
                {currentIndex < questions.length - 1 ? (
                  <>Далее <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>Результаты <Trophy className="h-4 w-4" /></>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
