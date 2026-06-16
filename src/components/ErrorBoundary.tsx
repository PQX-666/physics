import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4">
          <div className="max-w-md w-full bg-[var(--card)] rounded-2xl shadow-[var(--shadow-md)] p-8 text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-bold text-[var(--text)]">出了点问题</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {this.state.error?.message || '应用遇到了意外错误'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              重试
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
