import { useState, useEffect, type ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

const DESKTOP_ITEMS = [
  { id: 'home', label: '首页' },
  { id: 'exam', label: '冲刺' },
  { id: 'questions', label: '题库' },
  { id: 'mock', label: '模考' },
  { id: 'cram', label: '速查' },
  { id: 'review', label: '复习' },
  { id: 'library', label: '公式库' },
  { id: 'mindmap', label: '导图' },
  { id: 'weakness', label: '分析' },
  { id: 'settings', label: '设置' },
]

const MOBILE_ITEMS = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'exam', label: '冲刺', icon: '🎯' },
  { id: 'questions', label: '题库', icon: '📋' },
  { id: 'mock', label: '模考', icon: '⏱️' },
  { id: 'library', label: '公式库', icon: '📚' },
]

const MORE_ITEMS = [
  { id: 'review', label: '复习', icon: '🔄' },
  { id: 'cram', label: '速查', icon: '🚀' },
  { id: 'mindmap', label: '导图', icon: '🧠' },
  { id: 'weakness', label: '分析', icon: '📊' },
  { id: 'settings', label: '设置', icon: '⚙️' },
]

const THEME_KEY = 'physics-theme'

function getStoredTheme(): 'light' | 'dark' {
  try {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light'
  } catch { return 'light' }
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(getStoredTheme)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Desktop top bar */}
      <header className="hidden md:flex items-center justify-between h-14 px-6 bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-40">
        <button onClick={() => onNavigate('home')} className="text-base font-semibold tracking-tight text-[var(--primary)]">
          物理期末考试复习系统<span className="text-[11px] opacity-50 font-normal ml-0.5">条件反射训练器</span>
        </button>
        <nav className="flex items-center gap-0.5">
          {DESKTOP_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                currentPage === item.id
                  ? 'bg-[var(--primary-light)] text-[var(--primary)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--primary-light)]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            className="ml-2 w-9 h-9 flex items-center justify-center rounded-lg text-sm hover:bg-[var(--primary-light)] transition-colors"
            title={theme === 'light' ? '切换深色模式' : '切换浅色模式'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </header>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between h-12 px-3 bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-40">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <span className="text-sm font-semibold tracking-tight text-[var(--primary)]">
          {DESKTOP_ITEMS.find((n) => n.id === currentPage)?.label || '物理复习系统'}
        </span>
        <div className="w-8" />
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-5 pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] z-40 safe-area-bottom">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-1">
          {MOBILE_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setShowMore(false) }}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1 transition-colors ${
                currentPage === item.id
                  ? 'text-[var(--primary)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              <span className="text-xs leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium tracking-wide leading-none">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1 transition-colors ${
              showMore || MORE_ITEMS.some((m) => m.id === currentPage)
                ? 'text-[var(--primary)]'
                : 'text-[var(--text-muted)]'
            }`}
          >
            <span className="text-xs leading-none">⋯</span>
            <span className="text-[10px] font-medium tracking-wide leading-none">更多</span>
          </button>
        </div>
      </nav>

      {/* Mobile more drawer */}
      {showMore && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowMore(false)} />
          <div className="absolute bottom-14 left-0 right-0 bg-[var(--card)] rounded-t-2xl shadow-xl p-4 pb-6 animate-slide-up">
            <div className="w-8 h-1 bg-[var(--border)] rounded-full mx-auto mb-4" />
            <div className="grid grid-cols-3 gap-2">
              {MORE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setShowMore(false) }}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-colors ${
                    currentPage === item.id
                      ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                      : 'hover:bg-[var(--bg)] text-[var(--text-secondary)]'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="hidden md:block text-center py-6 text-xs text-[var(--text-muted)]">
        彭启轩
      </footer>
      <footer className="md:hidden text-center pb-24 pt-2 text-xs text-[var(--text-muted)]">
        彭启轩
      </footer>
    </div>
  )
}
