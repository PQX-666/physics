import { useState, useEffect } from 'react'

const WELCOME_KEY = 'physics-formula-trainer-welcome-seen'

export default function WelcomeModal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_KEY)
    if (!seen) setShow(true)
  }, [])

  function handleDismiss() {
    localStorage.setItem(WELCOME_KEY, '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center">
        <h2 className="text-xl font-bold text-[var(--text)] mb-1">Formula Reflex</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">此项目由彭启轩开发</p>

        <div className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 space-y-3">
          <p>基于三套大学物理 C 期末模拟卷（A、B、C卷）的公式神经反射训练系统。</p>
          <p>通过<strong className="text-[var(--text)]">主动回忆 + 间隔重复</strong>帮助你在考试时瞬间触发公式，而非翻书查找。</p>
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
