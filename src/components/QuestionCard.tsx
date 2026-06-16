import { useState } from 'react'
import type { MCQuestion, TFQuestion } from '../types/formula'

interface MCQCardProps {
  question: MCQuestion
  onResult?: (correct: boolean) => void
}

export function MCQCard({ question, onResult }: MCQCardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const correct = selected === question.ans

  function handleSelect(i: number) {
    if (submitted) return
    setSelected(i)
  }

  function handleSubmit() {
    if (selected === null) return
    setSubmitted(true)
    setShowExplanation(true)
    onResult?.(selected === question.ans)
  }

  function handleReset() {
    setSelected(null)
    setSubmitted(false)
    setShowExplanation(false)
  }

  const optLabels = ['A', 'B', 'C', 'D']

  return (
    <div className="max-w-lg mx-auto bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-5 space-y-4">
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span className="bg-[var(--primary-light)] text-[var(--primary)] px-2 py-0.5 rounded-full font-medium">{question.paper}卷</span>
        <span>第{question.num}题 · 单选</span>
      </div>

      <div className="text-sm text-[var(--text)] leading-relaxed" dangerouslySetInnerHTML={{ __html: question.q }} />

      <div className="space-y-2">
        {question.opts.map((opt, i) => {
          let borderClass = 'border-[var(--border)]'
          if (submitted) {
            if (i === question.ans) borderClass = 'border-[var(--success)] bg-green-50'
            else if (i === selected && !correct) borderClass = 'border-[var(--danger)] bg-red-50'
          } else if (i === selected) {
            borderClass = 'border-[var(--primary)] bg-[var(--primary-light)]'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-colors ${borderClass} ${
                submitted ? 'cursor-default' : 'hover:border-[var(--primary)] cursor-pointer'
              }`}
            >
              <span className="font-bold mr-2">{optLabels[i]}.</span>
              <span dangerouslySetInnerHTML={{ __html: opt }} />
            </button>
          )
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-opacity ${
            selected === null
              ? 'bg-[var(--border)] text-[var(--text-muted)]'
              : 'bg-[var(--primary)] text-white hover:opacity-90'
          }`}
        >
          提交答案
        </button>
      )}

      {submitted && (
        <>
          <div className={`p-3 rounded-xl text-sm font-medium ${correct ? 'bg-green-50 text-[var(--success)]' : 'bg-red-50 text-[var(--danger)]'}`}>
            {correct ? '✅ 回答正确！' : `❌ 回答错误，正确答案是 ${optLabels[question.ans]}`}
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full py-2 text-xs text-[var(--primary)] hover:underline"
          >
            {showExplanation ? '收起解析 ▲' : '查看解析 ▼'}
          </button>

          {showExplanation && (
            <div className="space-y-2">
              {question.oe && question.oe.map((exp, i) => (
                <div key={i} className="text-xs text-[var(--text-secondary)] p-2 rounded-lg bg-[var(--bg)]">
                  <span className="font-bold mr-1">{optLabels[i]}.</span>
                  <span dangerouslySetInnerHTML={{ __html: exp }} />
                </div>
              ))}
              {question.e && (
                <div className="text-xs text-[var(--text-secondary)] p-2 rounded-lg bg-[var(--bg)]">
                  <span dangerouslySetInnerHTML={{ __html: question.e }} />
                </div>
              )}
            </div>
          )}

          <button onClick={handleReset} className="w-full py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            重新作答
          </button>
        </>
      )}
    </div>
  )
}

// ==================== 判断题 ====================

interface TFCardProps {
  question: TFQuestion
  onResult?: (correct: boolean) => void
}

export function TFCard({ question, onResult }: TFCardProps) {
  const [selected, setSelected] = useState<boolean | null>(null)

  const correctAnswer = question.a === '正确'
  const submitted = selected !== null
  const correct = selected === correctAnswer

  function handleSelect(val: boolean) {
    if (submitted) return
    setSelected(val)
    onResult?.(val === correctAnswer)
  }

  function handleReset() {
    setSelected(null)
  }

  return (
    <div className="max-w-lg mx-auto bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-5 space-y-4">
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span className="bg-[var(--primary-light)] text-[var(--primary)] px-2 py-0.5 rounded-full font-medium">{question.paper}卷</span>
        <span>第{question.num}题 · 判断</span>
      </div>

      <div className="text-sm text-[var(--text)] leading-relaxed" dangerouslySetInnerHTML={{ __html: question.q }} />

      <div className="flex gap-3">
        {[true, false].map((val) => {
          let borderClass = 'border-[var(--border)] hover:border-[var(--primary)]'
          if (submitted) {
            if (val === correctAnswer) borderClass = 'border-[var(--success)] bg-green-50'
            else if (val === selected && !correct) borderClass = 'border-[var(--danger)] bg-red-50'
          } else if (val === selected) {
            borderClass = 'border-[var(--primary)] bg-[var(--primary-light)]'
          }

          return (
            <button
              key={String(val)}
              onClick={() => handleSelect(val)}
              disabled={submitted}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${borderClass} ${
                submitted ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {val ? '✅ 正确' : '❌ 错误'}
            </button>
          )
        })}
      </div>

      {submitted && (
        <>
          <div className={`p-3 rounded-xl text-sm font-medium ${correct ? 'bg-green-50 text-[var(--success)]' : 'bg-red-50 text-[var(--danger)]'}`}>
            {correct ? '✅ 判断正确！' : `❌ 判断错误，答案：${question.a}`}
          </div>
          <div className="text-xs text-[var(--text-secondary)] p-3 rounded-lg bg-[var(--bg)]" dangerouslySetInnerHTML={{ __html: question.e }} />
          <button onClick={handleReset} className="w-full py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            重新作答
          </button>
        </>
      )}
    </div>
  )
}
