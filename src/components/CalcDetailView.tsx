import { useState } from 'react'
import type { CalcQuestion } from '../types/formula'
import ThinkingFramework from './ThinkingFramework'
import MathRenderer from './MathRenderer'

interface CalcDetailViewProps {
  question: CalcQuestion
  onBack: () => void
}

export default function CalcDetailView({ question, onBack }: CalcDetailViewProps) {
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set())
  const [showThink, setShowThink] = useState(false)

  function toggleStep(i: number) {
    const next = new Set(revealedSteps)
    if (next.has(i)) next.delete(i); else next.add(i)
    setRevealedSteps(next)
  }

  function revealAll() { setRevealedSteps(new Set(question.steps.map((_, i) => i))) }
  function hideAll() { setRevealedSteps(new Set()) }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <button onClick={onBack} className="text-sm text-[var(--primary)] mb-2 inline-block">&larr; 返回列表</button>

      <div className="bg-[var(--card)] rounded-2xl shadow-[var(--shadow-sm)] p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-red-50 text-[var(--danger)] px-2 py-0.5 rounded-full font-bold">{question.paper}卷</span>
          <span className="text-xs text-[var(--text-muted)]">第{question.num}题</span>
          <span className="text-xs bg-orange-50 text-[var(--warning)] px-2 py-0.5 rounded-full">{question.pts}</span>
        </div>

        <h3 className="text-base font-bold text-[var(--text)]">{question.title}</h3>

        {/* Question text */}
        <div className="text-sm text-[var(--text)] leading-relaxed p-3 rounded-xl bg-[var(--bg)]" dangerouslySetInnerHTML={{ __html: question.q }} />

        {/* Thinking framework */}
        <ThinkingFramework fw={question.fw} />

        {/* Think hint */}
        <div className="flex items-start gap-2">
          <button
            onClick={() => setShowThink(!showThink)}
            className="text-xs text-[var(--warning)] hover:underline flex-shrink-0"
          >
            {showThink ? '隐藏思路 ▲' : '💭 点击看思路 ▼'}
          </button>
        </div>
        {showThink && (
          <div className="text-sm text-[var(--text-secondary)] bg-orange-50 rounded-xl p-3 leading-relaxed whitespace-pre-line">
            {question.think}
          </div>
        )}

        {/* Steps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[var(--text)]">解题步骤</div>
            <div className="flex gap-2">
              <button onClick={revealAll} className="text-xs text-[var(--primary)] hover:underline">全部展开</button>
              <button onClick={hideAll} className="text-xs text-[var(--text-muted)] hover:underline">全部收起</button>
            </div>
          </div>

          {question.steps.map((step, i) => (
            <div key={i} className="border border-[var(--border)] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleStep(i)}
                className="w-full text-left p-3 flex items-center justify-between hover:bg-[var(--bg)] transition-colors"
              >
                <span className="text-sm font-medium text-[var(--text)]">步骤{i + 1}. {step.s}</span>
                <span className="text-xs text-[var(--text-muted)]">{revealedSteps.has(i) ? '▲' : '▼'}</span>
              </button>
              {revealedSteps.has(i) && (
                <div className="px-3 pb-3">
                  <div className="p-3 rounded-lg bg-[var(--bg)]">
                    <MathRenderer html={step.e} className="text-sm text-[var(--text)] leading-relaxed" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Traps */}
        {question.traps.length > 0 && (
          <div className="bg-red-50 rounded-xl p-3">
            <div className="text-xs font-bold text-[var(--danger)] mb-1.5">⚠️ 易错陷阱</div>
            <ul className="space-y-1">
              {question.traps.map((trap, i) => (
                <li key={i} className="text-xs text-[var(--text)] flex gap-1.5">
                  <span className="text-[var(--danger)] flex-shrink-0">•</span>
                  <span>{trap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
