import { Component, type ReactNode } from 'react'
import { RotateCcw, AlertTriangle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    return (
      <div className="container py-16">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Что-то пошло не так</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {this.state.error?.message || 'Произошла непредвиденная ошибка'}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Попробовать снова
              </Button>
              <Button variant="outline" onClick={this.handleGoHome} className="gap-2">
                <Home className="h-4 w-4" />
                На главную
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}
