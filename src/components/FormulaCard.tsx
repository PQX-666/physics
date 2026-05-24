import { useState, useEffect } from 'react'
import type { FormulaCard as FormulaCardType, Rating } from '../types/formula'
import { RATING_LABELS } from '../types/formula'

interface FormulaCardProps {
  formula: FormulaCardType
  mode: 'recall' | 'speed'
  onRate: (rating: Rating) => void
}

type Phase = 'recall' | 'answer'

export default function FormulaCardView({ formula, mode: _mode, onRate }: FormulaCardProps) {
  const [phase, setPhase] = useState<Phase>('recall')

  // Reset phase when formula changes
  useEffect(() => {
    setPhase('recall')
  }, [formula.id])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (phase === 'recall') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          setPhase('answer')
        }
      } else if (phase === 'answer') {
        const num = parseInt(e.key)
        if (num >= 1 && num <= 5) {
          e.preventDefault()
          onRate(num as Rating)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, onRate])

  return (
    <div className="max-w-lg mx-auto">
      {phase === 'recall' && (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-8">
          <div className="text-xs text-[var(--text-secondary)] mb-6">{formula.chapter}</div>

          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">{formula.name}</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">请回忆这个公式，然后点击查看答案</p>

          <button
            onClick={() => setPhase('answer')}
            className="w-full py-3.5 bg-[var(--primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            显示答案 <span className="text-xs opacity-60 ml-1">Space</span>
          </button>
        </div>
      )}

      {phase === 'answer' && (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-sm)] p-8 space-y-6">
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-[var(--text)] py-6 bg-[var(--bg)] rounded-2xl">
              {formula.formula}
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed">{formula.meaning}</p>
          </div>

          {formula.variables.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">变量</div>
              <div className="grid grid-cols-2 gap-1.5">
                {formula.variables.map((v) => (
                  <div key={v.symbol} className="text-sm bg-[var(--bg)] rounded-lg px-3 py-2">
                    <span className="font-mono font-bold text-[var(--primary)]">{v.symbol}</span>
                    <span className="text-[var(--text-secondary)]"> — {v.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formula.conditions.length > 0 && (
            <div className="text-sm text-[var(--text-secondary)] bg-[var(--bg)] rounded-xl p-3">
              <span className="font-medium text-[var(--text)]">适用条件：</span>
              {formula.conditions.join('；')}
            </div>
          )}

          {formula.commonMistakes.length > 0 && (
            <div className="text-sm text-[var(--warning)] bg-orange-50 rounded-xl p-3">
              <span className="font-medium">易错：</span>
              {formula.commonMistakes.join('；')}
            </div>
          )}

          {formula.similarFormulas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {formula.similarFormulas.map((s) => (
                <span key={s} className="text-xs bg-[var(--primary-light)] text-[var(--primary)] px-2 py-1 rounded-lg">
                  区分：{s}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-secondary)] text-center mb-3">你的掌握程度？键盘 1-5</p>
            <div className="grid grid-cols-5 gap-2">
              {(Object.entries(RATING_LABELS) as [string, string][]).map(([key, label]) => {
                const r = Number(key) as Rating
                const active = r <= 2 ? 'bg-red-50 text-[var(--danger)] border-red-200' : r === 3 ? 'bg-orange-50 text-[var(--warning)] border-orange-200' : 'bg-green-50 text-[var(--success)] border-green-200'
                return (
                  <button key={key} onClick={() => onRate(r)} className={`py-3 rounded-xl text-sm font-medium border ${active} hover:opacity-80 transition-opacity`}>
                    <div className="text-lg">{r}</div>
                    <div className="text-xs mt-0.5">{label}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
