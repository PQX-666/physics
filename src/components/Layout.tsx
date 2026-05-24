import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

const NAV_ITEMS = [
  { id: 'home', label: '首页' },
  { id: 'exam', label: '冲刺' },
  { id: 'review', label: '复习' },
  { id: 'library', label: '公式库' },
  { id: 'weakness', label: '分析' },
  { id: 'settings', label: '设置' },
]

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FA]">
      {/* Desktop top bar */}
      <header className="hidden md:flex items-center justify-between h-14 px-6 bg-white border-b border-[#EBEEF2] sticky top-0 z-40">
        <button onClick={() => onNavigate('home')} className="text-base font-semibold tracking-tight text-[var(--primary)]">
          Formula Reflex
        </button>
        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                currentPage === item.id
                  ? 'bg-[var(--primary-light)] text-[var(--primary)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-center h-12 bg-white border-b border-[#EBEEF2] sticky top-0 z-40">
        <span className="text-sm font-semibold tracking-tight text-[var(--primary)]">
          {NAV_ITEMS.find((n) => n.id === currentPage)?.label || 'Formula Reflex'}
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-5 pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EBEEF2] z-40 safe-area-bottom">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-w-0 transition-colors ${
                currentPage === item.id
                  ? 'text-[var(--primary)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              <span className="text-xs font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="hidden md:block text-center py-6 text-xs text-[var(--text-muted)]">
        Formula Reflex Training · 彭启轩
      </footer>
      <footer className="md:hidden text-center pb-24 pt-2 text-xs text-[var(--text-muted)]">
        Formula Reflex Training · 彭启轩
      </footer>
    </div>
  )
}
