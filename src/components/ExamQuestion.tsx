import { useState } from 'react'
import type { ExamPattern } from '../types/formula'

interface ExamQuestionProps {
  pattern: ExamPattern
  mode: 'mcq' | 'tf' | 'fill'
  onResult: (correct: boolean) => void
}

export default function ExamQuestion({ pattern, mode, onResult }: ExamQuestionProps) {
  const [_selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [fillAnswer, setFillAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)

  function handleSubmit(choice: string) {
    setSelected(choice)
    setSubmitted(true)
    const letter = choice.slice(0, 1)
    const correct = pattern.correctAnswer
      ? letter === pattern.correctAnswer
      : choice.includes(pattern.answerExplanation.slice(0, 3))
    setIsCorrect(correct)
    onResult(correct)
  }

  function handleTFSubmit(value: boolean) {
    setSubmitted(true)
    const correct = pattern.isTrue != null ? value === pattern.isTrue : value
    setIsCorrect(correct)
    onResult(correct)
  }

  function handleFillSubmit() {
    setSubmitted(true)
    onResult(true)
  }

  function handleFillSelfRate(correct: boolean) {
    setIsCorrect(correct)
    // Re-call onResult with actual correctness for tracking
    onResult(correct)
  }

  const options = pattern.distractors || ['A', 'B', 'C', 'D']
  const badgeStyle = pattern.priority === 'S' ? 'bg-red-100 text-[var(--danger)]' : pattern.priority === 'A' ? 'bg-orange-100 text-[var(--warning)]' : 'bg-[var(--primary-light)] text-[var(--primary)]'

  return (
    <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-6 md:p-8 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeStyle}`}>{pattern.priority}级</span>
        <span className="text-xs text-[var(--text-muted)]">{pattern.chapter}</span>
      </div>

      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{pattern.title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">{pattern.sampleQuestion}</p>

      {!submitted && mode === 'mcq' && (
        <div className="space-y-2">
          {options.map((opt, i) => (
            <button key={i} onClick={() => handleSubmit(opt)} className="w-full text-left px-4 py-3 rounded-xl bg-[var(--bg)] hover:bg-[var(--primary-light)] text-sm text-[var(--text)] transition-colors">
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
      )}

      {!submitted && mode === 'tf' && (
        <div className="flex gap-3">
          <button onClick={() => handleTFSubmit(true)} className="flex-1 py-3 bg-green-50 text-[var(--success)] rounded-xl font-medium hover:bg-green-100 transition-colors">正确</button>
          <button onClick={() => handleTFSubmit(false)} className="flex-1 py-3 bg-red-50 text-[var(--danger)] rounded-xl font-medium hover:bg-red-100 transition-colors">错误</button>
        </div>
      )}

      {!submitted && mode === 'fill' && (
        <div className="space-y-3">
          <input type="text" value={fillAnswer} onChange={(e) => setFillAnswer(e.target.value)} placeholder="输入你的答案..." className="w-full px-4 py-3 bg-[var(--bg)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
          <button onClick={handleFillSubmit} className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">提交答案</button>
        </div>
      )}

      {submitted && (
        <div className="space-y-4 border-t border-[var(--border)] pt-4">
          {mode === 'fill' && !isCorrect && fillAnswer && (
            <div className="bg-orange-50 rounded-2xl p-4">
              <div className="text-sm font-semibold text-[var(--warning)] mb-2">自我评估</div>
              <p className="text-xs text-[var(--text-secondary)] mb-3">对照解析，你的答案是否正确？</p>
              <div className="flex gap-2">
                <button onClick={() => handleFillSelfRate(true)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${isCorrect ? 'bg-green-100 text-green-700' : ''}`}>✓ 正确</button>
                <button onClick={() => handleFillSelfRate(false)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${!isCorrect ? 'bg-red-100 text-[var(--danger)]' : ''}`}>✗ 错误</button>
              </div>
            </div>
          )}

          <div className={isCorrect ? 'bg-green-50 rounded-2xl p-4' : 'bg-red-50 rounded-2xl p-4'}>
            <div className={`text-sm font-semibold mb-2 ${isCorrect ? 'text-green-800' : 'text-[var(--danger)]'}`}>
              {isCorrect ? '✓ 回答正确' : '✗ 回答错误'}
            </div>
            <div className="text-sm font-semibold text-[var(--text)] mb-1">解析</div>
            <p className="text-sm text-[var(--text-secondary)]">{pattern.answerExplanation}</p>
          </div>

          {pattern.solutionStrategy.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">解题步骤</div>
              <ol className="list-decimal list-inside text-sm text-[var(--text-secondary)] space-y-1">
                {pattern.solutionStrategy.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}

          {pattern.commonTraps.length > 0 && (
            <div className="bg-orange-50 rounded-2xl p-4">
              <div className="text-sm font-semibold text-[var(--warning)] mb-2">常见陷阱</div>
              <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                {pattern.commonTraps.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
