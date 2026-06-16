import { useState } from 'react'
import type { FBQuestion } from '../types/formula'

interface FillBlankCardProps {
  question: FBQuestion
  onResult?: (correct: boolean) => void
}

export default function FillBlankCard({ question, onResult: _onResult }: FillBlankCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  function handleShow() {
    setShowAnswer(true)
  }

  function handleReset() {
    setShowAnswer(false)
  }

  return (
    <div className="max-w-lg mx-auto bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-5 space-y-4">
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span className="bg-[var(--primary-light)] text-[var(--primary)] px-2 py-0.5 rounded-full font-medium">{question.paper}卷</span>
        <span>第{question.num}题 · 填空</span>
      </div>

      <div className="text-sm text-[var(--text)] leading-relaxed" dangerouslySetInnerHTML={{ __html: question.q }} />

      {!showAnswer ? (
        <button
          onClick={handleShow}
          className="w-full py-3 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          查看答案与解析
        </button>
      ) : (
        <>
          <div className="p-4 rounded-xl bg-green-50 border border-[var(--success)]">
            <div className="text-xs font-bold text-[var(--success)] mb-1">正确答案</div>
            <div className="text-sm font-bold text-[var(--text)]" dangerouslySetInnerHTML={{ __html: question.a }} />
          </div>

          {question.fam && (
            <div className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-2 py-1 rounded-full inline-block">
              📐 {question.fam}
            </div>
          )}

          <div className="p-3 rounded-lg bg-[var(--bg)]">
            <div className="text-xs font-bold text-[var(--text-secondary)] mb-1">详细解析</div>
            <div className="text-xs text-[var(--text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: question.e }} />
          </div>

          <button onClick={handleReset} className="w-full py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            隐藏答案
          </button>
        </>
      )}
    </div>
  )
}
