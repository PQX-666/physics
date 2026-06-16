import { useState, useEffect } from 'react'

const WELCOME_KEY = 'physics-formula-trainer-welcome-seen'

interface WelcomeModalProps {
  onNavigate: (page: string) => void
}

const QUICK_ENTRIES = [
  { page: 'home', label: '开始复习', desc: '今日待复习公式', icon: '📝' },
  { page: 'exam', label: '期末靶向', desc: '高频考点冲刺', icon: '🎯' },
  { page: 'library', label: '公式库', desc: '浏览全部公式', icon: '📚' },
  { page: 'mindmap', label: '思维导图', desc: '知识框架总览', icon: '🗺️' },
]

export default function WelcomeModal({ onNavigate }: WelcomeModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_KEY)
    if (!seen) setShow(true)
  }, [])

  function handleDismiss() {
    localStorage.setItem(WELCOME_KEY, '1')
    setShow(false)
  }

  function handleNavigate(page: string) {
    localStorage.setItem(WELCOME_KEY, '1')
    setShow(false)
    onNavigate(page)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <h2 className="text-xl font-bold text-[var(--text)] mb-1">物理期末考试复习系统</h2>
        <p className="text-xs text-[var(--text-muted)] mb-5">条件反射训练器</p>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
          基于三套期末模拟卷，通过<strong className="text-[var(--text)]">主动回忆 + 间隔重复</strong>帮你在考场上瞬间触发公式。
        </p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          {QUICK_ENTRIES.map((entry) => (
            <button
              key={entry.page}
              onClick={() => handleNavigate(entry.page)}
              className="text-left bg-[var(--bg)] rounded-xl p-3 hover:bg-[var(--primary-light)] transition-colors"
            >
              <div className="text-lg mb-0.5">{entry.icon}</div>
              <div className="text-sm font-medium text-[var(--text)]">{entry.label}</div>
              <div className="text-xs text-[var(--text-muted)]">{entry.desc}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleDismiss}
          className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          开始使用
        </button>
      </div>
    </div>
  )
}
